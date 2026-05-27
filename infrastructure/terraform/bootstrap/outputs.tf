output "state_bucket_name" {
  description = "S3 bucket name — use in main Terraform backend config"
  value       = aws_s3_bucket.state.id
}

output "state_bucket_arn" {
  value = aws_s3_bucket.state.arn
}

output "dynamodb_lock_table" {
  description = "DynamoDB table name — use in main Terraform backend config"
  value       = aws_dynamodb_table.locks.name
}

output "backend_config_snippet" {
  description = "Paste this into infrastructure/terraform/main.tf backend block"
  value       = <<-EOT
    backend "s3" {
      bucket         = "${aws_s3_bucket.state.id}"
      key            = "prod/terraform.tfstate"
      region         = "${var.aws_region}"
      dynamodb_table = "${aws_dynamodb_table.locks.name}"
      encrypt        = true
    }
  EOT
}
