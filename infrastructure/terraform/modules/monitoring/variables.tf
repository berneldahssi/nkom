variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "alert_email" {
  description = "Email address for SNS alerts"
  type        = string
  default     = ""
}

variable "create_rds_alarms" {
  description = "Create RDS CloudWatch alarms"
  type        = bool
  default     = false
}

variable "create_redis_alarms" {
  description = "Create Redis CloudWatch alarms"
  type        = bool
  default     = false
}

variable "create_dashboard" {
  description = "Create CloudWatch dashboard"
  type        = bool
  default     = false
}

variable "rds_instance_id" {
  description = "RDS instance identifier"
  type        = string
  default     = ""
}

variable "redis_cluster_id" {
  description = "Redis cluster identifier"
  type        = string
  default     = ""
}
