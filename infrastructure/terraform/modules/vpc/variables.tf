variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "single_nat_gateway" {
  description = "Use single NAT gateway for cost savings"
  type        = bool
  default     = true
}

variable "flow_log_retention_days" {
  description = "VPC Flow Logs retention period in days"
  type        = number
  default     = 7
}
