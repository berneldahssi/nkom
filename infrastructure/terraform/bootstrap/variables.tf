variable "project_name" {
  description = "Project name — used as prefix for bucket and table names"
  type        = string
  default     = "nkom"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
