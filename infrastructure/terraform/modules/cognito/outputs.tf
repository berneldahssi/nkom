output "user_pool_id" {
  description = "Cognito User Pool ID → NEXT_PUBLIC_COGNITO_USER_POOL_ID"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "Cognito User Pool ARN (for IAM policies)"
  value       = aws_cognito_user_pool.main.arn
}

output "client_id" {
  description = "App client ID → NEXT_PUBLIC_COGNITO_CLIENT_ID"
  value       = aws_cognito_user_pool_client.web.id
}

output "hosted_domain" {
  description = "Hosted UI domain prefix → NEXT_PUBLIC_COGNITO_DOMAIN"
  value       = "${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

output "jwks_uri" {
  description = "JWKS endpoint for JWT verification on the backend"
  value       = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${aws_cognito_user_pool.main.id}/.well-known/jwks.json"
}

output "issuer" {
  description = "JWT issuer claim value"
  value       = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${aws_cognito_user_pool.main.id}"
}

data "aws_region" "current" {}
