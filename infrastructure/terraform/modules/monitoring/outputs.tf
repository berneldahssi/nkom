output "alerts_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "app_log_group_name" {
  description = "Application CloudWatch log group name"
  value       = aws_cloudwatch_log_group.app.name
}

output "rds_log_group_name" {
  description = "RDS CloudWatch log group name"
  value       = aws_cloudwatch_log_group.rds.name
}

output "dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = try(aws_cloudwatch_dashboard.main[0].dashboard_name, "")
}
