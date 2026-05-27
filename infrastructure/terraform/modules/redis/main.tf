terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }
}

# ElastiCache subnet group
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-cache-subnets"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-redis-subnet-group"
  }
}

# ElastiCache Redis cluster
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.project_name}-redis"
  engine               = "redis"
  engine_version       = var.engine_version
  node_type            = var.node_type
  num_cache_nodes      = var.num_cache_nodes
  parameter_group_name = "default.redis${var.engine_version_short}"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [var.security_group_id]

  # Encryption in transit
  transit_encryption_enabled = true
  auth_token                = var.auth_token

  # Encryption at rest
  at_rest_encryption_enabled = true

  # Automatic failover
  automatic_failover_enabled = var.automatic_failover_enabled

  # Maintenance
  maintenance_window = var.maintenance_window
  notification_topic_arn = var.notification_topic_arn

  tags = {
    Name = "${var.project_name}-redis"
  }
}
