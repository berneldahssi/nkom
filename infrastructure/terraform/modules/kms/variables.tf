variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "deletion_window_days" {
  description = "KMS key deletion window in days"
  type        = number
  default     = 10
}
