/**
 * Bootstrap — run once before the main Terraform workspace.
 *
 * Creates the S3 bucket and DynamoDB table that the main Terraform config
 * uses as its remote backend. Uses a local state file (bootstrap.tfstate)
 * because the S3 bucket doesn't exist yet when this is first applied.
 *
 * Usage:
 *   cd infrastructure/terraform/bootstrap
 *   AWS_PROFILE=nkom terraform init
 *   AWS_PROFILE=nkom terraform apply
 */

terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }

  # Intentionally local — this is the bootstrap, S3 doesn't exist yet.
  backend "local" {
    path = "bootstrap.tfstate"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "Terraform"
      Component = "bootstrap"
    }
  }
}

# ── S3 state bucket ──────────────────────────────────────────────

resource "aws_s3_bucket" "state" {
  bucket = "${var.project_name}-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    id     = "expire-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}

# ── DynamoDB lock table (free tier: 25 WCU / 25 RCU) ────────────

resource "aws_dynamodb_table" "locks" {
  name         = "${var.project_name}-terraform-locks"
  billing_mode = "PAY_PER_REQUEST" # On-demand — free at this scale
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
