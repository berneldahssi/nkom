terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }

  # Backend created by infrastructure/terraform/bootstrap — run bootstrap first.
  backend "s3" {
    bucket       = "nkom-terraform-state"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true  # native S3 locking (TF >= 1.10, requires versioning)
    encrypt      = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "NKOM"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ── Locals — resolve optional resource ARNs ───────────────────────

locals {
  kms_rds_key_arn = var.enable_kms_custom_keys ? module.kms[0].rds_key_arn : null
  kms_s3_key_arn  = var.enable_kms_custom_keys ? module.kms[0].s3_key_arn : null
  redis_cluster_id = var.enable_redis ? module.redis[0].redis_cluster_id : ""
}

# ── VPC and Networking ────────────────────────────────────────────

module "vpc" {
  source = "./modules/vpc"

  project_name            = var.project_name
  vpc_cidr                = var.vpc_cidr
  availability_zones      = data.aws_availability_zones.available.names
  private_subnet_cidrs    = var.private_subnet_cidrs
  public_subnet_cidrs     = var.public_subnet_cidrs
  single_nat_gateway      = var.environment != "production"
  flow_log_retention_days = var.flow_log_retention_days
}

# ── Encryption Keys (optional — $1/key/month × 3) ────────────────

module "kms" {
  count  = var.enable_kms_custom_keys ? 1 : 0
  source = "./modules/kms"

  project_name         = var.project_name
  deletion_window_days = var.kms_deletion_window_days
}

# ── Security Groups ───────────────────────────────────────────────

module "security_groups" {
  source = "./modules/security_groups"

  project_name    = var.project_name
  vpc_id          = module.vpc.vpc_id
  vpc_cidr        = var.vpc_cidr
  create_alb_rule = false
}

# ── RDS PostgreSQL ────────────────────────────────────────────────

module "rds" {
  source = "./modules/rds"

  project_name                = var.project_name
  private_subnet_ids          = module.vpc.private_subnets
  security_group_id           = module.security_groups.rds_security_group_id
  kms_key_arn                 = local.kms_rds_key_arn
  engine_version              = var.rds_engine_version
  instance_class              = var.db_instance_class
  allocated_storage           = var.db_allocated_storage
  max_allocated_storage       = var.db_max_allocated_storage
  database_name               = var.db_name
  db_username                 = var.db_username
  db_password                 = var.db_password
  backup_retention_days       = var.db_backup_retention_days
  backup_window               = var.db_backup_window
  maintenance_window          = var.db_maintenance_window
  multi_az                    = var.environment == "production"
  deletion_protection         = var.environment == "production"
  skip_final_snapshot         = var.environment != "production"
  enable_monitoring           = var.environment == "production"
  enable_performance_insights = var.environment == "production"
}

# ── ElastiCache Redis (optional — ~$13/month) ─────────────────────

module "redis" {
  count  = var.enable_redis ? 1 : 0
  source = "./modules/redis"

  project_name               = var.project_name
  private_subnet_ids         = module.vpc.private_subnets
  security_group_id          = module.security_groups.redis_security_group_id
  engine_version             = var.redis_engine_version
  engine_version_short       = "70"
  node_type                  = var.redis_node_type
  num_cache_nodes            = var.environment == "production" ? 2 : 1
  auth_token                 = var.redis_auth_token
  automatic_failover_enabled = var.environment == "production"
  maintenance_window         = var.redis_maintenance_window
  notification_topic_arn     = var.environment == "production" ? module.monitoring.alerts_topic_arn : null
}

# ── S3 Storage ────────────────────────────────────────────────────

module "s3" {
  source = "./modules/s3"

  project_name            = var.project_name
  kms_key_arn             = local.kms_s3_key_arn
  version_expiration_days = var.s3_version_expiration_days
  object_expiration_days  = var.s3_object_expiration_days
  logs_expiration_days    = var.s3_logs_expiration_days
}

# ── Monitoring ────────────────────────────────────────────────────

module "monitoring" {
  source = "./modules/monitoring"

  project_name        = var.project_name
  aws_region          = var.aws_region
  log_retention_days  = var.log_retention_days
  alert_email         = var.alert_email
  create_rds_alarms   = var.environment == "production"
  create_redis_alarms = var.environment == "production" && var.enable_redis
  create_dashboard    = var.environment == "production"
  rds_instance_id     = module.rds.db_instance_id
  redis_cluster_id    = local.redis_cluster_id
}

# ── Data sources ──────────────────────────────────────────────────

data "aws_availability_zones" "available" {
  state = "available"
}
