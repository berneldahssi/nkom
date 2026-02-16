output "redis_cluster_id" {
  description = "Redis cluster ID"
  value       = aws_elasticache_cluster.redis.cluster_id
}

output "redis_endpoint" {
  description = "Redis endpoint address"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_cluster.redis.port
}

output "redis_engine_version" {
  description = "Redis engine version"
  value       = aws_elasticache_cluster.redis.engine_version
}
