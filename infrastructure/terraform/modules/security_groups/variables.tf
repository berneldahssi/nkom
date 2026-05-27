variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
}

variable "create_alb_rule" {
  description = "Create ALB ingress rule for app security group"
  type        = bool
  default     = false
}
