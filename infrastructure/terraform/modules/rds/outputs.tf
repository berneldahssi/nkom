output "db_instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.postgres.id
}

output "db_endpoint" {
  description = "RDS endpoint (host:port)"
  value       = aws_db_instance.postgres.endpoint
}

output "db_host" {
  description = "RDS hostname"
  value       = split(":", aws_db_instance.postgres.endpoint)[0]
}

output "db_port" {
  description = "RDS port"
  value       = aws_db_instance.postgres.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.postgres.db_name
}

output "db_username" {
  description = "Database master username"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}
