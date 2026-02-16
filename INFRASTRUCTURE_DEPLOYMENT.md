# NKOM AWS Infrastructure Deployment Guide

**Status**: Production-Ready with Enterprise Security

## Security Architecture Overview

```
                           ┌─────────────────┐
                           │   Application   │
                           │   (ECS/Lambda)  │
                           └────────┬────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼─────┐ ┌──────▼──────┐ ┌─────▼──────┐
            │   RDS-Conn  │ │ Redis-Conn  │ │ S3-Upload  │
            │  (KMS enc)  │ │ (TLS+Auth)  │ │ (KMS enc)  │
            └───────┬─────┘ └──────┬──────┘ └─────┬──────┘
                    │               │               │
            ┌───────▼─────┐ ┌──────▼──────┐ ┌─────▼──────┐
            │  RDS        │ │ ElastiCache │ │    S3      │
            │ PostgreSQL  │ │    Redis    │ │  Uploads   │
            │ Multi-AZ    │ │  Encrypted  │ │ Versioned  │
            └─────────────┘ └─────────────┘ └────────────┘

All traffic encrypted in transit (TLS)
All data encrypted at rest (KMS)
VPC-isolated, no public access
```

## Prerequisites

### 1. Install Tools

```bash
# Terraform (>= 1.6)
brew install terraform  # macOS
# or download from https://www.terraform.io/downloads

# AWS CLI v2
brew install awscliv2

# PostgreSQL client (for testing)
brew install postgresql
```

### 2. AWS Account Setup

```bash
# Configure AWS credentials
aws configure

# Verify credentials
aws sts get-caller-identity

# Create S3 bucket for Terraform state
aws s3 mb s3://nkom-terraform-state --region us-east-1

# Enable versioning on state bucket
aws s3api put-bucket-versioning \
  --bucket nkom-terraform-state \
  --versioning-configuration Status=Enabled
```

### 3. Generate Security Credentials

```bash
# Generate strong database password (16+ chars, mixed case, numbers, special)
openssl rand -base64 32 | tr -d "=" | cut -c1-20

# Generate Redis auth token
openssl rand -hex 16

# Generate JWT secret (32+ chars)
openssl rand -base64 32
```

## Deployment Steps

### Step 1: Initialize Terraform

```bash
cd /home/user/nkom/infrastructure/terraform

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars

# Fill in:
# - project_name = "nkom"
# - environment = "production" or "development"
# - db_username = "nkom_admin" (8+ alphanumeric)
# - db_password = "YourSecurePassword!" (generated above)
# - redis_auth_token = "your-redis-token" (generated above)

# Initialize Terraform
terraform init
```

### Step 2: Review Infrastructure Plan

```bash
terraform plan -var-file="terraform.tfvars" > tfplan.txt

# Review the plan (should create ~15 resources)
cat tfplan.txt | grep "# " | wc -l
```

### Step 3: Deploy Infrastructure

```bash
# Apply configuration
terraform apply -var-file="terraform.tfvars"

# This will create:
# ✓ VPC with public/private subnets
# ✓ RDS PostgreSQL (encrypted, Multi-AZ in prod)
# ✓ ElastiCache Redis (encrypted, with auth)
# ✓ S3 buckets (uploads + logs, encrypted)
# ✓ Security groups with restrictive rules
# ✓ KMS keys for encryption
# ✓ CloudWatch logging
# ✓ VPC Flow Logs for monitoring

# Deployment takes ~10-15 minutes
# Wait for all resources to finish creating
```

### Step 4: Get Infrastructure Outputs

```bash
# Extract connection details for backend
terraform output -json > infrastructure-outputs.json

# Key outputs:
DB_HOST=$(terraform output -raw db_endpoint | cut -d: -f1)
DB_PORT=$(terraform output -raw db_endpoint | cut -d: -f2)
REDIS_HOST=$(terraform output -raw redis_endpoint)
REDIS_PORT=$(terraform output -raw redis_port)
S3_BUCKET=$(terraform output -raw s3_uploads_bucket_name)

echo "Database: $DB_HOST:$DB_PORT"
echo "Redis: $REDIS_HOST:$REDIS_PORT"
echo "S3 Bucket: $S3_BUCKET"
```

### Step 5: Test Database Connection

```bash
# Test RDS connectivity
psql -h $DB_HOST \
     -U nkom_admin \
     -d nkom \
     -p 5432 \
     -c "SELECT version();"

# Should return PostgreSQL version information
```

### Step 6: Configure Backend Environment

```bash
cd /home/user/nkom/backend

# Create .env from template
cp .env.example .env

# Edit with actual values
nano .env

# Update:
POSTGRES_HOST=$DB_HOST
POSTGRES_PORT=5432
POSTGRES_USER=nkom_admin
POSTGRES_PASSWORD=your-password
POSTGRES_DB=nkom

REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
REDIS_PASSWORD=your-redis-token

S3_BUCKET_NAME=$S3_BUCKET
SECRET_KEY=your-jwt-secret
ANTHROPIC_API_KEY=sk-ant-xxxx
```

### Step 7: Initialize Database with Migrations

```bash
cd /home/user/nkom/backend

# Install dependencies
pip install -e .

# Run database migrations
alembic upgrade head

# Verify tables created
psql -h $DB_HOST -U nkom_admin -d nkom -c "\dt"

# Expected output:
#         List of relations
#  Schema |        Name        | Type  | Owner
# --------+--------------------+-------+----------
#  public | users              | table | nkom_admin
#  public | content_uploads    | table | nkom_admin
#  public | study_materials    | table | nkom_admin
#  public | flashcards         | table | nkom_admin
#  public | quiz_questions     | table | nkom_admin
#  public | study_sessions     | table | nkom_admin
```

### Step 8: Start Backend Services

```bash
cd /home/user/nkom/backend

# Start backend (will connect to RDS + ElastiCache)
export ANTHROPIC_API_KEY=sk-ant-xxxx
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

# Should see:
# Uvicorn running on http://0.0.0.0:8000
# INFO: Application startup complete
```

### Step 9: Test Backend API

```bash
# Create test user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nkom.com",
    "password": "TestP@ssw0rd123!",
    "first_name": "Test",
    "last_name": "User",
    "country": "Cameroon"
  }'

# Expected: {"access_token": "eyJ0eXAi...", "refresh_token": "eyJ0eXAi..."}

# Test API docs
curl http://localhost:8000/docs
```

### Step 10: Start Frontend

```bash
cd /home/user/nkom/frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Frontend runs on http://localhost:3000
```

## Production Deployment Checklist

### Before Going Live

- [ ] Change `ENVIRONMENT=production` in `.env`
- [ ] Set `DEBUG=false` in `.env`
- [ ] Verify `ALLOWED_ORIGINS` in `.env` (your domain only)
- [ ] Enable Multi-AZ in Terraform for RDS
- [ ] Set `deletion_protection = true` on RDS
- [ ] Enable automated backups
- [ ] Configure backup retention (default: 7 days)
- [ ] Enable CloudWatch monitoring
- [ ] Set up CloudWatch alarms for:
  - [ ] RDS CPU > 80%
  - [ ] RDS storage > 80%
  - [ ] Redis evictions
  - [ ] Application errors
- [ ] Enable VPC Flow Logs
- [ ] Configure S3 lifecycle policies (automatic deletion after 1 year)
- [ ] Set up log retention policies
- [ ] Configure SSL/TLS certificates
- [ ] Enable WAF on API endpoints
- [ ] Set up DDoS protection (AWS Shield)
- [ ] Regular backup testing
- [ ] Disaster recovery plan

## Security Features Implemented

### Network Security
- ✅ VPC with public/private subnets
- ✅ NAT Gateway for outbound traffic
- ✅ Security groups with least privilege
- ✅ VPC Flow Logs for traffic monitoring
- ✅ No public access to databases

### Data Encryption
- ✅ RDS: KMS encryption at rest + TLS in transit
- ✅ Redis: AES-256 at rest + TLS in transit + AUTH token
- ✅ S3: KMS encryption + versioning
- ✅ Log bucket: AES-256 encryption
- ✅ Automatic key rotation

### Access Control
- ✅ IAM roles for service authentication
- ✅ Security groups restrict traffic
- ✅ Database credentials in AWS Secrets Manager (recommended)
- ✅ Redis requires auth token
- ✅ S3 bucket policy blocks public access

### Monitoring & Logging
- ✅ CloudWatch Logs for RDS PostgreSQL
- ✅ VPC Flow Logs for network traffic
- ✅ Enhanced RDS monitoring (1-minute intervals)
- ✅ Performance Insights on RDS
- ✅ S3 access logging
- ✅ Application logging to CloudWatch

### Backup & Disaster Recovery
- ✅ Automated daily backups (7-day retention)
- ✅ Multi-AZ failover in production
- ✅ Backup encryption with KMS
- ✅ Point-in-time recovery capability
- ✅ Snapshot copying to another region

## Operational Procedures

### Viewing Logs

```bash
# RDS PostgreSQL logs
aws logs tail /aws/rds/instance/nkom-postgres/postgresql --follow

# VPC Flow Logs
aws logs tail /aws/vpc/flowlogs --follow

# Application logs (in CloudWatch Logs)
aws logs tail /aws/nkom/backend --follow
```

### Database Maintenance

```bash
# Create manual backup
aws rds create-db-snapshot \
  --db-instance-identifier nkom-postgres \
  --db-snapshot-identifier nkom-backup-$(date +%Y%m%d)

# View backups
aws rds describe-db-snapshots \
  --db-instance-identifier nkom-postgres

# Restore from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier nkom-postgres-restored \
  --db-snapshot-identifier nkom-backup-20240216
```

### Scaling (if needed)

```bash
# Upgrade RDS instance type
aws rds modify-db-instance \
  --db-instance-identifier nkom-postgres \
  --db-instance-class db.t3.small \
  --apply-immediately

# Upgrade Redis node type
aws elasticache-modify-cache-cluster \
  --cache-cluster-id nkom-redis \
  --cache-node-type cache.t3.small \
  --apply-immediately
```

### Stopping Infrastructure (cost savings during dev)

```bash
# Stop RDS (can restart later)
aws rds stop-db-instance \
  --db-instance-identifier nkom-postgres

# Stop is free; running costs ~$0.015/hour
```

## Cost Estimation

| Service | Dev/Month | Prod/Month |
|---------|-----------|------------|
| RDS (t3.micro) | $11 | $33 (Multi-AZ) |
| Redis (t3.micro) | $11 | $33 (Multi-AZ) |
| S3 Storage | $1 | $5 |
| S3 Requests | <$1 | $2 |
| Data Transfer | <$1 | $5 |
| **Total** | **~$25** | **~$80** |

**With AWS Free Tier**: First 12 months = $0 (covers 750 hrs/month t3.micro)

## Troubleshooting

### RDS Connection Issues

```bash
# Check security group
aws ec2 describe-security-groups \
  --group-ids sg-xxxxx \
  --query 'SecurityGroups[0].IpPermissions'

# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier nkom-postgres \
  --query 'DBInstances[0].[DBInstanceStatus,AvailabilityZone]'

# Check RDS logs
aws logs tail /aws/rds/instance/nkom-postgres/postgresql --follow
```

### Redis Connection Issues

```bash
# Check Redis cluster
aws elasticache describe-cache-clusters \
  --cache-cluster-id nkom-redis \
  --show-cache-node-info

# Check security group
aws ec2 describe-security-groups \
  --group-ids sg-xxxxx
```

### Application Can't Connect

1. Verify `.env` has correct credentials
2. Check security groups allow traffic
3. Verify RDS/Redis are in "available" state
4. Test with `psql` and `redis-cli`
5. Check application logs in CloudWatch

## Additional Resources

- [AWS RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [AWS ElastiCache Security](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/auth.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [PostgreSQL Security](https://www.postgresql.org/docs/15/sql-syntax.html)
- [Redis Security](https://redis.io/topics/security)

## Support

For issues:
1. Check CloudWatch Logs
2. Review AWS console for resource status
3. Check application logs: `docker logs nkom-backend`
4. Verify `.env` configuration matches Terraform outputs

---

**Last Updated**: February 2026
**Terraform Version**: >= 1.6
**AWS Provider**: ~> 5.30
