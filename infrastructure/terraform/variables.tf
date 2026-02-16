variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "nkom"
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
