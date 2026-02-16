output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnets for internal services"
  value       = module.vpc.private_subnets
}

output "db_endpoint" {
  description = "RDS PostgreSQL endpoint (host:port)"
  value       = aws_db_instance.postgres.endpoint
}

output "db_instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.postgres.identifier
}

output "db_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_cluster.redis.port
}

output "redis_security_group_id" {
  description = "Security group ID for Redis"
  value       = aws_security_group.redis.id
}

output "app_security_group_id" {
  description = "Security group ID for application servers"
  value       = aws_security_group.app.id
}

output "s3_uploads_bucket_name" {
  description = "S3 bucket for user uploads"
  value       = aws_s3_bucket.uploads.id
}

output "s3_logs_bucket_name" {
  description = "S3 bucket for logs"
  value       = aws_s3_bucket.logs.id
}

output "kms_rds_key_id" {
  description = "KMS key ID for RDS encryption"
  value       = aws_kms_key.rds.id
}

output "kms_s3_key_id" {
  description = "KMS key ID for S3 encryption"
  value       = aws_kms_key.s3.id
}

output "terraform_outputs" {
  description = "All outputs in JSON format for backend configuration"
  value = {
    db_host              = split(":", aws_db_instance.postgres.endpoint)[0]
    db_port              = 5432
    db_name              = aws_db_instance.postgres.db_name
    redis_host           = aws_elasticache_cluster.redis.cache_nodes[0].address
    redis_port           = aws_elasticache_cluster.redis.port
    s3_uploads_bucket    = aws_s3_bucket.uploads.id
    app_security_group   = aws_security_group.app.id
  }
  sensitive = false
}
