output "uploads_bucket_id" {
  description = "S3 uploads bucket name"
  value       = aws_s3_bucket.uploads.id
}

output "uploads_bucket_arn" {
  description = "S3 uploads bucket ARN"
  value       = aws_s3_bucket.uploads.arn
}

output "logs_bucket_id" {
  description = "S3 logs bucket name"
  value       = aws_s3_bucket.logs.id
}

output "logs_bucket_arn" {
  description = "S3 logs bucket ARN"
  value       = aws_s3_bucket.logs.arn
}
