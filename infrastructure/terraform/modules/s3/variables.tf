variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "kms_key_arn" {
  description = "KMS key ARN for S3 encryption. Null = use free AES-256 (SSE-S3) encryption."
  type        = string
  default     = null
}

variable "version_expiration_days" {
  description = "Days before deleting old S3 object versions"
  type        = number
  default     = 30
}

variable "object_expiration_days" {
  description = "Days before deleting S3 objects"
  type        = number
  default     = 365
}

variable "logs_expiration_days" {
  description = "Days before deleting log files"
  type        = number
  default     = 90
}
