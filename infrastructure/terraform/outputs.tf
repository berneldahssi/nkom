# VPC Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnets for internal services"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "Public subnets"
  value       = module.vpc.public_subnets
}

# RDS Outputs
output "db_endpoint" {
  description = "RDS PostgreSQL endpoint (host:port)"
  value       = module.rds.db_endpoint
  sensitive   = false
}

output "db_host" {
  description = "RDS hostname"
  value       = module.rds.db_host
  sensitive   = false
}

output "db_port" {
  description = "RDS port"
  value       = module.rds.db_port
  sensitive   = false
}

output "db_name" {
  description = "Database name"
  value       = module.rds.db_name
}

output "db_instance_id" {
  description = "RDS instance identifier"
  value       = module.rds.db_instance_id
}

# Redis Outputs (only populated when enable_redis = true)
output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = var.enable_redis ? module.redis[0].redis_endpoint : null
}

output "redis_port" {
  description = "Redis port"
  value       = var.enable_redis ? module.redis[0].redis_port : null
}

# Security Groups Outputs
output "app_security_group_id" {
  description = "Application security group ID"
  value       = module.security_groups.app_security_group_id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = module.security_groups.rds_security_group_id
}

output "redis_security_group_id" {
  description = "Redis security group ID"
  value       = module.security_groups.redis_security_group_id
}

# S3 Outputs
output "s3_uploads_bucket_name" {
  description = "S3 bucket for user uploads"
  value       = module.s3.uploads_bucket_id
}

output "s3_logs_bucket_name" {
  description = "S3 bucket for logs"
  value       = module.s3.logs_bucket_id
}

# KMS Outputs (only populated when enable_kms_custom_keys = true)
output "kms_rds_key_id" {
  description = "KMS key ID for RDS encryption"
  value       = var.enable_kms_custom_keys ? module.kms[0].rds_key_id : null
}

output "kms_s3_key_id" {
  description = "KMS key ID for S3 encryption"
  value       = var.enable_kms_custom_keys ? module.kms[0].s3_key_id : null
}

output "kms_secrets_key_id" {
  description = "KMS key ID for Secrets Manager"
  value       = var.enable_kms_custom_keys ? module.kms[0].secrets_key_id : null
}

# Monitoring Outputs
output "alerts_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = module.monitoring.alerts_topic_arn
}

output "app_log_group_name" {
  description = "CloudWatch log group for application"
  value       = module.monitoring.app_log_group_name
}

output "rds_log_group_name" {
  description = "CloudWatch log group for RDS"
  value       = module.monitoring.rds_log_group_name
}

# Cognito Outputs — copy these into frontend/.env.local and backend/.env
output "cognito_user_pool_id" {
  description = "NEXT_PUBLIC_COGNITO_USER_POOL_ID"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "NEXT_PUBLIC_COGNITO_CLIENT_ID"
  value       = module.cognito.client_id
}

output "cognito_domain" {
  description = "NEXT_PUBLIC_COGNITO_DOMAIN"
  value       = module.cognito.hosted_domain
}

output "cognito_jwks_uri" {
  description = "Backend COGNITO_JWKS_URI for JWT verification"
  value       = module.cognito.jwks_uri
}

output "cognito_issuer" {
  description = "Backend COGNITO_ISSUER"
  value       = module.cognito.issuer
}

# Combined Outputs for Backend Configuration
output "backend_configuration" {
  description = "All outputs needed for backend .env configuration"
  value = {
    db_host              = module.rds.db_host
    db_port              = module.rds.db_port
    db_name              = module.rds.db_name
    redis_host           = var.enable_redis ? module.redis[0].redis_endpoint : null
    redis_port           = var.enable_redis ? module.redis[0].redis_port : null
    s3_uploads_bucket    = module.s3.uploads_bucket_id
    app_security_group   = module.security_groups.app_security_group_id
  }
  sensitive = false
}
