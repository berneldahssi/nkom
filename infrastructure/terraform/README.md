# NKOM Infrastructure - Modular Terraform

Production-ready, modular Terraform configuration for NKOM infrastructure on AWS.

## Architecture

```
terraform/
├── main.tf                 # Root module - orchestrates child modules
├── variables.tf            # Root variables
├── outputs.tf              # Root outputs
├── terraform.tfvars.example
│
├── modules/                # Modular infrastructure components
│   ├── vpc/               # VPC, subnets, NAT Gateway, Flow Logs
│   ├── kms/               # KMS keys for encryption
│   ├── rds/               # RDS PostgreSQL database
│   ├── redis/             # ElastiCache Redis cache
│   ├── s3/                # S3 buckets with versioning, encryption
│   ├── security_groups/   # Security groups for all services
│   └── monitoring/        # CloudWatch logs, alarms, dashboards
│
├── environments/           # Environment-specific configurations
│   ├── development.tfvars
│   ├── staging.tfvars
│   └── production.tfvars
│
└── README.md              # This file
```

## Modules

### VPC Module
- VPC with configurable CIDR blocks
- Public and private subnets across 2+ AZs
- NAT Gateway for outbound traffic
- VPC Flow Logs for network monitoring

**Files**: `modules/vpc/main.tf`, `variables.tf`, `outputs.tf`

### KMS Module
- RDS encryption key with auto-rotation
- S3 encryption key with auto-rotation
- Secrets Manager encryption key
- All keys with proper deletion windows

**Files**: `modules/kms/main.tf`, `variables.tf`, `outputs.tf`

### RDS Module
- PostgreSQL 15.4 database
- Automated backups with retention policy
- Enhanced monitoring (production)
- Performance Insights (production)
- Multi-AZ failover (production)
- IAM database authentication

**Files**: `modules/rds/main.tf`, `variables.tf`, `outputs.tf`

### Redis Module
- ElastiCache Redis cluster
- Encryption at rest + in transit
- AUTH token authentication
- Automatic failover (production)
- SNS notifications for events

**Files**: `modules/redis/main.tf`, `variables.tf`, `outputs.tf`

### S3 Module
- Uploads bucket with versioning
- Logs bucket with lifecycle policies
- KMS encryption on both buckets
- Public access blocking
- Access logging enabled

**Files**: `modules/s3/main.tf`, `variables.tf`, `outputs.tf`

### Security Groups Module
- App security group (for application servers)
- RDS security group (PostgreSQL access only)
- Redis security group (cache access only)
- Least privilege ingress rules

**Files**: `modules/security_groups/main.tf`, `variables.tf`, `outputs.tf`

### Monitoring Module
- CloudWatch log groups for app and RDS
- SNS topic for alarms
- RDS CPU/storage alarms (production)
- Redis CPU/eviction alarms (production)
- CloudWatch dashboard (production)

**Files**: `modules/monitoring/main.tf`, `variables.tf`, `outputs.tf`

## Usage

### 1. Initialize Terraform

```bash
cd infrastructure/terraform

# Copy terraform.tfvars template
cp terraform.tfvars.example terraform.tfvars

# Edit with your credentials
nano terraform.tfvars
```

### 2. Choose Environment

```bash
# For development
terraform plan -var-file="environments/development.tfvars"
terraform apply -var-file="environments/development.tfvars"

# For staging
terraform plan -var-file="environments/staging.tfvars"
terraform apply -var-file="environments/staging.tfvars"

# For production
terraform plan -var-file="environments/production.tfvars"
terraform apply -var-file="environments/production.tfvars"
```

### 3. Verify Deployment

```bash
# Get outputs
terraform output

# Get specific output
terraform output db_host

# Get formatted output for backend
terraform output backend_configuration
```

## Key Features

### Security
- ✅ Encryption at rest (KMS for RDS/S3, AES-256 for Redis logs)
- ✅ Encryption in transit (TLS for all services)
- ✅ Security groups with least privilege
- ✅ Private subnets for databases
- ✅ No public database access
- ✅ IAM authentication for RDS
- ✅ AUTH tokens for Redis

### Reliability
- ✅ Multi-AZ deployment (production)
- ✅ Automated backups
- ✅ Point-in-time recovery
- ✅ Automatic failover (production)
- ✅ Health checks and monitoring

### Scalability
- ✅ Auto-scaling storage for RDS
- ✅ Versioned S3 objects
- ✅ Modular design for easy updates

### Cost Optimization
- ✅ Single NAT Gateway (development)
- ✅ Configurable instance types
- ✅ Free tier eligible
- ✅ S3 lifecycle policies for cleanup

## Environment Differences

| Feature | Dev | Staging | Production |
|---------|-----|---------|-----------|
| RDS Instance | t3.micro | t3.small | t3.small |
| RDS Multi-AZ | No | No | Yes |
| RDS Monitoring | No | No | Yes |
| Redis Nodes | 1 | 1 | 2 |
| Redis Failover | No | No | Yes |
| Log Retention | 3 days | 7 days | 30 days |
| Alerts | No | Email | Email |
| Backup Retention | 7 days | 14 days | 30 days |

## Adding New Modules

To add a new infrastructure component:

1. Create a directory in `modules/`
   ```bash
   mkdir modules/new-service
   ```

2. Create `main.tf`, `variables.tf`, `outputs.tf`
   ```bash
   touch modules/new-service/{main.tf,variables.tf,outputs.tf}
   ```

3. Add module call in root `main.tf`
   ```hcl
   module "new_service" {
     source = "./modules/new-service"
     # Pass variables
   }
   ```

4. Export outputs in root `outputs.tf`
   ```hcl
   output "new_service_id" {
     value = module.new_service.id
   }
   ```

## Troubleshooting

### Terraform State Issues

```bash
# Check state
terraform state list

# Show specific resource
terraform state show module.rds.aws_db_instance.postgres

# Force unlock (careful!)
terraform force-unlock <LOCK_ID>
```

### Module Errors

```bash
# Validate modules
terraform validate

# Format code
terraform fmt -recursive

# Init with upgrade
terraform init -upgrade
```

### AWS Issues

```bash
# Check credentials
aws sts get-caller-identity

# Check RDS instance
aws rds describe-db-instances --db-instance-identifier nkom-postgres

# Check Redis cluster
aws elasticache describe-cache-clusters --cache-cluster-id nkom-redis
```

## Best Practices

1. **Always use `terraform plan` first**
   ```bash
   terraform plan -var-file="environments/production.tfvars" > plan.txt
   # Review plan.txt before applying
   ```

2. **Keep state files secure**
   - State is stored in S3 with encryption enabled
   - Never commit `terraform.tfstate` to git
   - Use `.gitignore` for sensitive files

3. **Use environment-specific tfvars**
   - Never hardcode production credentials
   - Keep credentials in `terraform.tfvars` (git-ignored)
   - Rotate credentials regularly

4. **Tag all resources**
   - Modules automatically tag resources
   - Use consistent naming: `{project-name}-{resource-type}`

5. **Test in development first**
   - Always test changes in development
   - Promote to staging, then production

## Maintenance

### Update Terraform Version

```bash
# Check current version
terraform version

# Update to latest
terraform init -upgrade
```

### Update AWS Provider

```bash
# Check provider version
terraform version

# Update terraform.tf to latest provider version
# Then run
terraform init -upgrade
```

### Backup State

```bash
# State is automatically backed up in S3 versioning
# To create manual backup
aws s3 cp s3://nkom-terraform-state/prod/terraform.tfstate \
  ./backup-$(date +%Y%m%d).tfstate
```

## Outputs

After successful deployment, Terraform outputs:

- **VPC Details**: vpc_id, subnet IDs
- **RDS Details**: endpoint, host, port, instance ID
- **Redis Details**: endpoint, port, cluster ID
- **Security**: security group IDs for each service
- **Encryption**: KMS key IDs for audit
- **Monitoring**: SNS topic, CloudWatch log group names
- **Backend Config**: JSON with all backend env vars needed

## Cost Estimation

Run cost analysis:

```bash
# Use Infracost (if installed)
infracost breakdown --path .

# Or check AWS pricing calculator
# https://calculator.aws
```

## Support

For issues:

1. Check CloudFormation events: `aws cloudformation describe-stack-events`
2. Review module docs in `modules/*/README.md` (if exists)
3. Check Terraform docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
4. Review AWS RDS/ElastiCache documentation

---

**Version**: 1.0 (Modular)
**Last Updated**: February 2026
**AWS Provider**: ~> 5.30
**Terraform**: >= 1.6
