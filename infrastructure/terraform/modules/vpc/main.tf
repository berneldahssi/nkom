terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway   = false  # re-enable when ECS is deployed; RDS/S3 don't need internet
  enable_dns_hostnames = true

  # VPC Flow Logs for security monitoring
  enable_flow_log = false  # $0.50/GB ingested — re-enable for compliance/security audits

  tags = {
    Name = "${var.project_name}-vpc"
  }
}
