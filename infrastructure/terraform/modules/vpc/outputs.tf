output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}

output "nat_gateway_ids" {
  description = "NAT Gateway IDs (empty until enable_nat_gateway = true)"
  value       = module.vpc.natgw_ids
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = module.vpc.vpc_cidr_block
}

output "private_route_table_ids" {
  description = "Private route table IDs (for VPC endpoint associations)"
  value       = module.vpc.private_route_table_ids
}
