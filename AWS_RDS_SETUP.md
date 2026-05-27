# AWS RDS PostgreSQL Setup Guide for NKOM

## Prerequisites
- AWS Account (with free tier eligibility or paid)
- AWS CLI installed (`pip install awscli`)
- Configured AWS credentials (`aws configure`)

---

## Step 1: Create RDS PostgreSQL Instance (10-15 minutes)

### Via AWS Console (Easiest)

1. **Go to RDS Console**
   - Visit: https://console.aws.amazon.com/rds/home
   - Click "Create database"

2. **Choose Engine**
   - Select **PostgreSQL**
   - Version: **15.3** (or latest)

3. **Templates**
   - Select: **Free tier** (if eligible)
   - Or: **Dev/Test**

4. **Database Name Configuration**
   ```
   DB Instance Identifier: nkom-postgres-dev
   Master username: nkom_admin
   Master password: [Generate strong password - save it!]
   ```

5. **Storage**
   - Storage type: **gp3 (General Purpose SSD)**
   - Allocated storage: **20 GB** (free tier default)
   - Storage autoscaling: ON

6. **Connectivity**
   - Public accessibility: **YES** (so your app can reach it)
   - VPC: Default VPC
   - Security group: Create new or use default
   - Database port: **5432** (default)

7. **Additional Configuration**
   ```
   Initial database name: nkom
   Backup retention: 7 days (free tier)
   Multi-AZ: NO (for dev)
   Database authentication: Password authentication
   ```

8. **Create Database**
   - Click "Create database"
   - ⏳ Wait 3-5 minutes for creation (status: "Creating" → "Available")

---

## Step 2: Security Group Configuration

Once RDS is created, allow your local machine to connect:

1. **Get RDS Endpoint**
   - Go to RDS Databases
   - Click on `nkom-postgres-dev`
   - Copy the **Endpoint** (looks like: `nkom-postgres-dev.c9akciq32.us-east-1.rds.amazonaws.com`)

2. **Configure Security Group**
   - In RDS details, find **VPC security groups**
   - Click the security group name
   - Add inbound rule:
     ```
     Type: PostgreSQL (5432)
     Protocol: TCP
     Port Range: 5432
     Source: 0.0.0.0/0 (your IP for production)
     ```

---

## Step 3: Get Your Connection Details

RDS should now be **Available**. Get these values:

```
Host: nkom-postgres-dev.xxxxx.us-east-1.rds.amazonaws.com
Port: 5432
Database: nkom
Username: nkom_admin
Password: [Your master password]
```

---

## Step 4: Update Your .env File

Edit `backend/.env`:

```bash
cd /home/user/nkom/backend
nano .env
```

Update these values:

```env
# Database - RDS Connection
POSTGRES_USER=nkom_admin
POSTGRES_PASSWORD=YourStrongPasswordHere
POSTGRES_HOST=nkom-postgres-dev.xxxxx.us-east-1.rds.amazonaws.com
POSTGRES_PORT=5432
POSTGRES_DB=nkom
```

**Save and exit** (Ctrl+X, Y, Enter in nano)

---

## Step 5: Test Connection from Local Machine

Before running migrations, test if you can connect:

```bash
# Install PostgreSQL client if not present
# Mac: brew install postgresql
# Ubuntu/Debian: sudo apt-get install postgresql-client
# Windows: Download pgAdmin or psql from postgresql.org

# Test connection
psql -h nkom-postgres-dev.xxxxx.us-east-1.rds.amazonaws.com \
     -U nkom_admin \
     -d nkom \
     -p 5432 \
     -c "SELECT version();"
```

✅ You should see the PostgreSQL version

---

## Step 6: Create Database Tables (Migrations)

Now run Alembic to create all tables from your schema:

```bash
cd /home/user/nkom/backend

# Install dependencies first
pip install -e .

# Run migrations
alembic upgrade head
```

Expected output:
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl with target database 'nkom'
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 001, initial schema
```

✅ Tables are now created!

---

## Step 7: Verify Tables Were Created

```bash
# Connect to your RDS database
psql -h nkom-postgres-dev.xxxxx.us-east-1.rds.amazonaws.com \
     -U nkom_admin \
     -d nkom

# List all tables
\dt

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

✅ All 6 tables created successfully!

---

## Step 8: Start Your Backend

```bash
cd /home/user/nkom/backend

# Set your Claude API key
export ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE

# Start the backend
uvicorn app.main:app --reload --port 8000
```

Backend runs on: http://localhost:8000

---

## Step 9: Test the API

```bash
# 1. Register a user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nkom.com",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "country": "Cameroon"
  }'

# Response: access_token + refresh_token (save the access_token!)

# 2. View API docs
# Open: http://localhost:8000/docs
```

---

## Troubleshooting

### "Connection refused" or "Cannot reach database"

```bash
# 1. Check RDS is running
aws rds describe-db-instances --db-instance-identifier nkom-postgres-dev

# 2. Verify security group allows your IP
# Go to RDS → Security → Inbound rules
# Make sure port 5432 is open to your IP (or 0.0.0.0/0 for dev)

# 3. Test with psql
psql -h YOUR-ENDPOINT -U nkom_admin -d nkom
```

### "Alembic upgrade fails"

```bash
# Make sure .env has correct connection details
# Restart terminal after changing .env
source ~/.bashrc  # or load your shell config

# Try again
alembic upgrade head
```

### RDS Instance Won't Start

- Check AWS region matches your credentials
- Verify account has RDS permissions
- Check storage quota not exceeded

---

## Cost Estimate

**AWS Free Tier (12 months)**
- 750 hours/month of `db.t3.micro` ✅ FREE
- 20 GB storage ✅ FREE
- 20 GB backup ✅ FREE

**After Free Tier**
- `db.t3.micro`: ~$0.015/hour (~$11/month)
- Storage: ~$1 per GB-month
- Backup: ~$0.10 per GB-month

👉 **Use AWS free tier while developing!**

---

## Next: Frontend Setup

Once backend is running with RDS:

```bash
cd /home/user/nkom/frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

---

## Useful Commands

```bash
# View RDS instance
aws rds describe-db-instances --db-instance-identifier nkom-postgres-dev

# View RDS logs
aws rds describe-db-log-files --db-instance-identifier nkom-postgres-dev

# Create backup
aws rds create-db-snapshot \
  --db-instance-identifier nkom-postgres-dev \
  --db-snapshot-identifier nkom-backup-manual

# Stop instance (saves costs during development pauses)
aws rds stop-db-instance --db-instance-identifier nkom-postgres-dev

# Start instance
aws rds start-db-instance --db-instance-identifier nkom-postgres-dev
```

---

## Summary

✅ Database created in AWS RDS
✅ Tables created via Alembic migrations
✅ Backend connected to cloud database
✅ Ready for development!

**Time to complete: ~20-30 minutes**

For questions, check AWS RDS docs: https://docs.aws.amazon.com/rds/
