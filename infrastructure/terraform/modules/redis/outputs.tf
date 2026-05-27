output "redis_cluster_id" {
  description = "Redis replication group ID"
  value       = aws_elasticache_replication_group.redis.id
}

output "redis_endpoint" {
  description = "Redis primary endpoint address"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_replication_group.redis.port
}

output "redis_engine_version" {
  description = "Redis engine version"
  value       = aws_elasticache_replication_group.redis.engine_version_actual
}
