variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "google_client_id" {
  description = "Google OAuth 2.0 client ID (leave empty to skip Google IdP)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth 2.0 client secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "app_url" {
  description = "Production app URL (e.g. https://nkom.app)"
  type        = string
}

variable "ses_from_email" {
  description = "Verified SES email for sending auth emails (leave empty to use Cognito default)"
  type        = string
  default     = ""
}

variable "ses_arn" {
  description = "SES identity ARN (required when ses_from_email is set)"
  type        = string
  default     = ""
}

variable "token_validity_hours" {
  description = "Access and ID token validity in hours"
  type        = number
  default     = 1
}

variable "refresh_token_validity_days" {
  description = "Refresh token validity in days"
  type        = number
  default     = 30
}
