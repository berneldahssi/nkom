locals {
  domain_prefix    = "${var.project_name}-auth-${var.environment}"
  use_google       = var.google_client_id != ""
  use_custom_email = var.ses_from_email != ""
}

# ── User Pool ──────────────────────────────────────────────────────────────────
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}"

  # Email is the username
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Case-insensitive emails
  username_configuration {
    case_sensitive = false
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  # Verification email
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Your NKOM verification code"
    email_message        = "Your NKOM verification code is {####}. It expires in 24 hours."
  }

  email_configuration {
    email_sending_account = local.use_custom_email ? "DEVELOPER" : "COGNITO_DEFAULT"
    from_email_address    = local.use_custom_email ? var.ses_from_email : null
    source_arn            = local.use_custom_email ? var.ses_arn : null
  }

  # Self-service account recovery via email only
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Standard attributes we'll use
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
    string_attribute_constraints {
      min_length = 3
      max_length = 255
    }
  }

  schema {
    name                = "given_name"
    attribute_data_type = "String"
    required            = false
    mutable             = true
    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }

  schema {
    name                = "family_name"
    attribute_data_type = "String"
    required            = false
    mutable             = true
    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }

  user_pool_add_ons {
    # OFF keeps costs zero; switch to AUDIT or ENFORCED when you add WAF
    advanced_security_mode = "OFF"
  }

  # Prevent accidental deletion in production
  deletion_protection = var.environment == "production" ? "ACTIVE" : "INACTIVE"

  tags = {
    Name        = "${var.project_name}-user-pool-${var.environment}"
    Environment = var.environment
  }
}

# ── Google Identity Provider ───────────────────────────────────────────────────
resource "aws_cognito_identity_provider" "google" {
  count = local.use_google ? 1 : 0

  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "email profile openid"
  }

  attribute_mapping = {
    email       = "email"
    given_name  = "given_name"
    family_name = "family_name"
    username    = "sub"
    picture     = "picture"
  }
}

# ── Hosted UI Domain ───────────────────────────────────────────────────────────
resource "aws_cognito_user_pool_domain" "main" {
  domain       = local.domain_prefix
  user_pool_id = aws_cognito_user_pool.main.id
}

# ── Web App Client (Amplify / Next.js) ────────────────────────────────────────
resource "aws_cognito_user_pool_client" "web" {
  name         = "${var.project_name}-web-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id

  # Public client — no client secret (Amplify uses PKCE for OAuth)
  generate_secret = false

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = var.token_validity_hours
  id_token_validity      = var.token_validity_hours
  refresh_token_validity = var.refresh_token_validity_days

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",       # Amplify email/password (SRP is more secure than plain)
    "ALLOW_REFRESH_TOKEN_AUTH",  # Token refresh
    "ALLOW_USER_PASSWORD_AUTH",  # Fallback for server-side auth
  ]

  # OAuth / Hosted UI
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]

  callback_urls = [
    "http://localhost:3000/auth/callback",
    "${var.app_url}/auth/callback",
  ]

  logout_urls = [
    "http://localhost:3000/",
    "${var.app_url}/",
  ]

  supported_identity_providers = local.use_google ? ["COGNITO", "Google"] : ["COGNITO"]

  prevent_user_existence_errors = "ENABLED"

  depends_on = [aws_cognito_identity_provider.google]
}
