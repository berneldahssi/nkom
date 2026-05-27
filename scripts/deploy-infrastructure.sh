#!/bin/bash
# NKOM AWS Infrastructure Deployment Script
# Automates Terraform deployment with security best practices

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TERRAFORM_DIR="./infrastructure/terraform"
PROJECT_NAME="nkom"
ENVIRONMENT=${1:-"development"}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}NKOM AWS Infrastructure Deployment${NC}"
echo -e "${BLUE}Environment: $ENVIRONMENT${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "\n${YELLOW}Checking prerequisites...${NC}"

    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}✗ Terraform not found. Install from: https://www.terraform.io/downloads${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Terraform${NC}"

    if ! command -v aws &> /dev/null; then
        echo -e "${RED}✗ AWS CLI not found. Install with: pip install awscli${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ AWS CLI${NC}"

    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}✗ AWS credentials not configured. Run: aws configure${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ AWS credentials${NC}"

    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    REGION=$(aws configure get region)
    echo -e "${GREEN}✓ AWS Account: $ACCOUNT_ID, Region: $REGION${NC}"
}

# Create Terraform state bucket
create_state_bucket() {
    echo -e "\n${YELLOW}Checking Terraform state bucket...${NC}"

    STATE_BUCKET="nkom-terraform-state"

    if aws s3 ls "s3://$STATE_BUCKET" 2>&1 | grep -q 'NoSuchBucket'; then
        echo -e "${YELLOW}Creating S3 bucket for Terraform state...${NC}"
        aws s3 mb "s3://$STATE_BUCKET" --region $REGION

        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket "$STATE_BUCKET" \
            --versioning-configuration Status=Enabled

        # Enable encryption
        aws s3api put-bucket-encryption \
            --bucket "$STATE_BUCKET" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }'

        # Block public access
        aws s3api put-public-access-block \
            --bucket "$STATE_BUCKET" \
            --public-access-block-configuration \
            "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

        echo -e "${GREEN}✓ State bucket created and secured${NC}"
    else
        echo -e "${GREEN}✓ State bucket exists${NC}"
    fi
}

# Generate secure credentials
generate_credentials() {
    echo -e "\n${YELLOW}Generating secure credentials...${NC}"

    if [ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]; then
        echo -e "${YELLOW}Creating terraform.tfvars with generated credentials${NC}"

        DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=" | cut -c1-24)
        REDIS_TOKEN=$(openssl rand -hex 16)

        cat > "$TERRAFORM_DIR/terraform.tfvars" << EOF
project_name      = "$PROJECT_NAME"
environment        = "$ENVIRONMENT"
aws_region         = "$REGION"
db_instance_class  = "db.t3.micro"
db_username        = "nkom_admin"
db_password        = "$DB_PASSWORD"
redis_auth_token   = "$REDIS_TOKEN"
backup_retention_days = 7
EOF

        echo -e "${GREEN}✓ Credentials generated and saved to terraform.tfvars${NC}"
        echo -e "${YELLOW}  DB Password: ${DB_PASSWORD:0:10}...${NC}"
        echo -e "${YELLOW}  Redis Token: ${REDIS_TOKEN:0:10}...${NC}"
    else
        echo -e "${GREEN}✓ terraform.tfvars exists (using existing credentials)${NC}"
    fi
}

# Initialize Terraform
init_terraform() {
    echo -e "\n${YELLOW}Initializing Terraform...${NC}"

    cd "$TERRAFORM_DIR"
    terraform init -upgrade
    cd - > /dev/null

    echo -e "${GREEN}✓ Terraform initialized${NC}"
}

# Validate Terraform
validate_terraform() {
    echo -e "\n${YELLOW}Validating Terraform configuration...${NC}"

    cd "$TERRAFORM_DIR"
    terraform validate
    cd - > /dev/null

    echo -e "${GREEN}✓ Terraform configuration valid${NC}"
}

# Plan infrastructure
plan_terraform() {
    echo -e "\n${YELLOW}Planning infrastructure changes...${NC}"

    cd "$TERRAFORM_DIR"
    terraform plan -var-file="terraform.tfvars" -out=tfplan.out
    cd - > /dev/null

    echo -e "${GREEN}✓ Plan saved to tfplan.out${NC}"
    echo -e "${YELLOW}Review the plan above. Press Enter to continue or Ctrl+C to cancel.${NC}"
    read -p "Continue with deployment? (yes/no): " CONFIRM

    if [ "$CONFIRM" != "yes" ]; then
        echo -e "${RED}Deployment cancelled${NC}"
        exit 1
    fi
}

# Apply Terraform
apply_terraform() {
    echo -e "\n${YELLOW}Applying Terraform configuration...${NC}"
    echo -e "${RED}WARNING: This will create AWS resources and incur costs!${NC}"
    echo -e "${YELLOW}Deployment will take 10-15 minutes...${NC}"

    cd "$TERRAFORM_DIR"
    terraform apply tfplan.out
    cd - > /dev/null

    echo -e "${GREEN}✓ Infrastructure deployed successfully${NC}"
}

# Get infrastructure outputs
get_outputs() {
    echo -e "\n${YELLOW}Retrieving infrastructure outputs...${NC}"

    cd "$TERRAFORM_DIR"
    terraform output -json > ../../infrastructure-outputs.json
    cd - > /dev/null

    # Extract key values
    DB_HOST=$(cd "$TERRAFORM_DIR" && terraform output -raw db_endpoint | cut -d: -f1 && cd - > /dev/null)
    REDIS_HOST=$(cd "$TERRAFORM_DIR" && terraform output -raw redis_endpoint && cd - > /dev/null)
    S3_BUCKET=$(cd "$TERRAFORM_DIR" && terraform output -raw s3_uploads_bucket_name && cd - > /dev/null)

    echo -e "${GREEN}✓ Outputs saved to infrastructure-outputs.json${NC}"
    echo -e "\n${BLUE}Connection Details:${NC}"
    echo -e "${GREEN}Database Host:${NC} $DB_HOST"
    echo -e "${GREEN}Redis Host:${NC} $REDIS_HOST"
    echo -e "${GREEN}S3 Bucket:${NC} $S3_BUCKET"
}

# Update backend configuration
update_backend_config() {
    echo -e "\n${YELLOW}Next: Update backend/.env with infrastructure outputs${NC}"
    echo -e "${YELLOW}Template: backend/.env.example${NC}"
    echo -e "${YELLOW}Run: cp backend/.env.example backend/.env && nano backend/.env${NC}"
}

# Main execution
main() {
    check_prerequisites
    create_state_bucket
    generate_credentials
    init_terraform
    validate_terraform
    plan_terraform
    apply_terraform
    get_outputs
    update_backend_config

    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}Deployment Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo -e "1. Update backend/.env with credentials from terraform.tfvars"
    echo -e "2. Test database connection: psql -h \$DB_HOST -U nkom_admin -d nkom"
    echo -e "3. Run migrations: cd backend && alembic upgrade head"
    echo -e "4. Start backend: uvicorn app.main:app --reload"
    echo -e "5. Start frontend: cd frontend && npm run dev"
    echo -e "\n${BLUE}Documentation:${NC}"
    echo -e "- INFRASTRUCTURE_DEPLOYMENT.md - Full deployment guide"
    echo -e "- infrastructure/terraform/ - Infrastructure as Code"
    echo -e "- backend/.env.example - Configuration template"
}

# Run main function
main
