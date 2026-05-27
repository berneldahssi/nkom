terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }
}

# CloudWatch Log Group for application
resource "aws_cloudwatch_log_group" "app" {
  name              = "/aws/${var.project_name}/backend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-app-logs"
  }
}

# CloudWatch Log Group for RDS
resource "aws_cloudwatch_log_group" "rds" {
  name              = "/aws/rds/instance/${var.project_name}-postgres/postgresql"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-rds-logs"
  }
}

# SNS Topic for Alarms
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts"

  tags = {
    Name = "${var.project_name}-alerts-topic"
  }
}

resource "aws_sns_topic_subscription" "alerts_email" {
  count     = var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# RDS CPU Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  count = var.create_rds_alarms ? 1 : 0

  alarm_name          = "${var.project_name}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Alert when RDS CPU exceeds 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# RDS Storage Alarm
resource "aws_cloudwatch_metric_alarm" "rds_storage" {
  count = var.create_rds_alarms ? 1 : 0

  alarm_name          = "${var.project_name}-rds-storage-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "2147483648"  # 2GB in bytes
  alarm_description   = "Alert when RDS free storage is below 2GB"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# Redis CPU Alarm
resource "aws_cloudwatch_metric_alarm" "redis_cpu" {
  count = var.create_redis_alarms ? 1 : 0

  alarm_name          = "${var.project_name}-redis-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = "300"
  statistic           = "Average"
  threshold           = "75"
  alarm_description   = "Alert when Redis CPU exceeds 75%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = var.redis_cluster_id
  }
}

# Redis Eviction Alarm
resource "aws_cloudwatch_metric_alarm" "redis_evictions" {
  count = var.create_redis_alarms ? 1 : 0

  alarm_name          = "${var.project_name}-redis-evictions"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Evictions"
  namespace           = "AWS/ElastiCache"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Alert when Redis is evicting keys"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = var.redis_cluster_id
  }
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  count          = var.create_dashboard ? 1 : 0
  dashboard_name = "${var.project_name}-infrastructure"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", { stat = "Average", label = "RDS CPU" }],
            ["AWS/ElastiCache", "CPUUtilization", { stat = "Average", label = "Redis CPU" }],
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "CPU Utilization"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/RDS", "DatabaseConnections", { stat = "Average", label = "RDS Connections" }],
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Database Connections"
        }
      }
    ]
  })
}
