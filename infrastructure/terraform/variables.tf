variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "nkom"
}

# ── Cost toggles ─────────────────────────────────────────────────
# Disable to save money during early development.

variable "enable_redis" {
  description = "Deploy ElastiCache Redis (~$13/month). Disable to skip."
  type        = bool
  default     = false
}

variable "enable_kms_custom_keys" {
  description = "Create customer-managed KMS keys ($1/key/month × 3). Disable to use free AWS-managed encryption."
  type        = bool
  default     = false
}

variable "environment" {
  description = "Deployment environment (development, staging, production)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t3.micro"
}

variable "db_username" {
  description = "Database master username (minimum 8 characters, alphanumeric)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.db_username) >= 8 && can(regex("^[a-zA-Z0-9_]+$", var.db_username))
    error_message = "Database username must be at least 8 characters and contain only alphanumeric and underscore characters."
  }
}

variable "db_password" {
  description = "Database master password (minimum 16 characters, must include uppercase, lowercase, numbers, special chars)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 16 && can(regex("[a-z]", var.db_password)) && can(regex("[A-Z]", var.db_password)) && can(regex("[0-9]", var.db_password)) && can(regex("[!@#$%^&*()_+\\-=\\[\\]{};:',.<>?/]", var.db_password))
    error_message = "Database password must be at least 16 characters and include uppercase, lowercase, numbers, and special characters."
  }
}

variable "redis_auth_token" {
  description = "Redis auth token for authentication (minimum 16 characters, alphanumeric and special chars)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.redis_auth_token) >= 16 && can(regex("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:',.<>?/]+$", var.redis_auth_token))
    error_message = "Redis auth token must be at least 16 characters and contain only alphanumeric and allowed special characters."
  }
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7

  validation {
    condition     = var.backup_retention_days >= 1 && var.backup_retention_days <= 35
    error_message = "Backup retention must be between 1 and 35 days."
  }
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "flow_log_retention_days" {
  description = "VPC Flow Logs retention period"
  type        = number
  default     = 7
}

# KMS Configuration
variable "kms_deletion_window_days" {
  description = "KMS key deletion window in days"
  type        = number
  default     = 10
}

# RDS Configuration
variable "rds_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "nkom"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "db_backup_retention_days" {
  description = "RDS backup retention period"
  type        = number
  default     = 7
}

variable "db_backup_window" {
  description = "RDS backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "db_maintenance_window" {
  description = "RDS maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Redis Configuration
variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_maintenance_window" {
  description = "Redis maintenance window"
  type        = string
  default     = "sun:05:00-sun:06:00"
}

# S3 Configuration
variable "s3_version_expiration_days" {
  description = "Days before deleting old S3 object versions"
  type        = number
  default     = 30
}

variable "s3_object_expiration_days" {
  description = "Days before deleting S3 objects"
  type        = number
  default     = 365
}

variable "s3_logs_expiration_days" {
  description = "Days before deleting S3 log files"
  type        = number
  default     = 90
}

# Monitoring Configuration
variable "log_retention_days" {
  description = "CloudWatch log retention period"
  type        = number
  default     = 7
}

variable "alert_email" {
  description = "Email address for CloudWatch alarms"
  type        = string
  default     = ""
}

# ── Cognito ───────────────────────────────────────────────────────

variable "app_url" {
  description = "Frontend URL for Cognito OAuth callback (e.g. https://nkom.app)"
  type        = string
  default     = "http://localhost:3000"
}

variable "google_client_id" {
  description = "Google OAuth client ID (leave empty to skip Google IdP)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "ses_from_email" {
  description = "Verified SES email for sending auth emails (leave empty to use Cognito default sender)"
  type        = string
  default     = ""
}

variable "ses_arn" {
  description = "SES identity ARN (required when ses_from_email is set)"
  type        = string
  default     = ""
}
