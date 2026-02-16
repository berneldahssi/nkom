terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }

  backend "s3" {
    bucket = "nkom-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
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

# VPC Networking
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  # VPC Flow Logs for security monitoring
  enable_flow_log                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true
  flow_log_retention_in_days           = 7
}

# KMS key for database encryption
resource "aws_kms_key" "rds" {
  description             = "KMS key for NKOM RDS encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = { Name = "${var.project_name}-rds-key" }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/${var.project_name}-rds"
  target_key_id = aws_kms_key.rds.key_id
}

# KMS key for S3 encryption
resource "aws_kms_key" "s3" {
  description             = "KMS key for NKOM S3 encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = { Name = "${var.project_name}-s3-key" }
}

resource "aws_kms_alias" "s3" {
  name          = "alias/${var.project_name}-s3"
  target_key_id = aws_kms_key.s3.key_id
}

# RDS Enhanced Monitoring IAM Role
resource "aws_iam_role" "rds_monitoring" {
  count = var.environment == "production" ? 1 : 0
  name  = "${var.project_name}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count      = var.environment == "production" ? 1 : 0
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# RDS Database
resource "aws_db_instance" "postgres" {
  identifier     = "${var.project_name}-postgres"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn

  db_name  = "nkom"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  # Security & Backups
  backup_retention_period            = 7
  backup_window                      = "03:00-04:00"
  multi_az                           = var.environment == "production" ? true : false
  skip_final_snapshot                = var.environment != "production"
  deletion_protection                = var.environment == "production" ? true : false
  enabled_cloudwatch_logs_exports    = ["postgresql"]
  copy_tags_to_snapshot              = true

  # IAM database auth for enhanced security
  enabled_iam_database_authentication = true

  # Enhanced monitoring (production only)
  monitoring_interval = var.environment == "production" ? 60 : 0
  monitoring_role_arn = var.environment == "production" ? aws_iam_role.rds_monitoring[0].arn : null

  # Performance insights (production only)
  performance_insights_enabled          = var.environment == "production" ? true : false
  performance_insights_retention_period = 7
  performance_insights_kms_key_id      = var.environment == "production" ? aws_kms_key.rds.arn : null

  # Maintenance windows
  maintenance_window       = "sun:04:00-sun:05:00"
  auto_minor_version_upgrade = true

  # Publicly accessible disabled for security
  publicly_accessible = false

  tags = { Name = "${var.project_name}-postgres" }

  depends_on = [aws_iam_role.rds_monitoring]
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnets"
  subnet_ids = module.vpc.private_subnets

  tags = { Name = "${var.project_name}-db-subnet-group" }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.project_name}-redis"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]

  # Encryption in transit
  transit_encryption_enabled = true
  auth_token                = var.redis_auth_token

  # Encryption at rest (if supported by instance type in production)
  at_rest_encryption_enabled = true

  tags = { Name = "${var.project_name}-redis" }
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-cache-subnets"
  subnet_ids = module.vpc.private_subnets

  tags = { Name = "${var.project_name}-redis-subnet-group" }
}

# S3 Storage - User Uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "${var.project_name}-user-uploads-${data.aws_caller_identity.current.account_id}"

  tags = { Name = "${var.project_name}-uploads" }
}

# S3 Block Public Access
resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Versioning
resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Server-side encryption with KMS
resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

# S3 Logging
resource "aws_s3_bucket_logging" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "uploads-logs/"
}

# S3 Lifecycle policy - delete old versions after 30 days
resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    id     = "delete-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    expiration {
      days = 365  # Delete objects after 1 year
    }
  }
}

# S3 Logging Bucket
resource "aws_s3_bucket" "logs" {
  bucket = "${var.project_name}-logs-${data.aws_caller_identity.current.account_id}"

  tags = { Name = "${var.project_name}-logs" }
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket = aws_s3_bucket.logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Logs Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Security Groups
resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-rds-"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "PostgreSQL from app servers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-rds-sg" }
}

resource "aws_security_group" "redis" {
  name_prefix = "${var.project_name}-redis-"
  description = "Security group for ElastiCache Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Redis from app servers"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-redis-sg" }
}

resource "aws_security_group" "app" {
  name_prefix = "${var.project_name}-app-"
  description = "Security group for application servers"
  vpc_id      = module.vpc.vpc_id

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-app-sg" }
}

# Data source for AWS account ID
data "aws_caller_identity" "current" {}
