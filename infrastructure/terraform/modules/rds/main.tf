terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }
}

# RDS subnet group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnets"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# RDS Enhanced Monitoring IAM Role
resource "aws_iam_role" "rds_monitoring" {
  count = var.enable_monitoring ? 1 : 0
  name  = "${var.project_name}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })

  tags = {
    Name = "${var.project_name}-rds-monitoring-role"
  }
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count      = var.enable_monitoring ? 1 : 0
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier     = "${var.project_name}-postgres"
  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_encrypted     = true
  kms_key_id           = var.kms_key_arn

  db_name  = var.database_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  # Security & Backups
  backup_retention_period            = var.backup_retention_days
  backup_window                      = var.backup_window
  multi_az                           = var.multi_az
  skip_final_snapshot                = var.skip_final_snapshot
  deletion_protection                = var.deletion_protection
  enabled_cloudwatch_logs_exports    = ["postgresql"]
  copy_tags_to_snapshot              = true

  # IAM database authentication
  iam_database_authentication_enabled = true

  # Enhanced monitoring
  monitoring_interval = var.enable_monitoring ? 60 : 0
  monitoring_role_arn = var.enable_monitoring ? aws_iam_role.rds_monitoring[0].arn : null

  # Performance insights
  performance_insights_enabled          = var.enable_performance_insights
  performance_insights_retention_period = var.performance_insights_retention_days
  performance_insights_kms_key_id      = var.enable_performance_insights ? var.kms_key_arn : null

  # Maintenance
  maintenance_window        = var.maintenance_window
  auto_minor_version_upgrade = true

  # Security
  publicly_accessible = false

  tags = {
    Name = "${var.project_name}-postgres"
  }

  depends_on = [aws_iam_role.rds_monitoring]
}
