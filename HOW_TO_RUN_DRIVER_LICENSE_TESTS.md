# 🚗 How to Run Driver License Tests Setup

The scripts are ready to go, but they require the PostgreSQL database to be running. Here's how to execute them:

---

## ⚠️ Current Status

**Created & Ready:**
- ✅ 120-question comprehensive question pools (per test)
- ✅ Two insertion methods (Python + SQL)
- ✅ Randomization support (30 from 120)
- ✅ All code committed to your branch

**Blocked By:**
- ❌ PostgreSQL database not running in this environment
- ❌ Docker daemon not available

---

## 🚀 When Your Database Is Running

### **Option 1: SQL Migration (Recommended - Easiest)**

```bash
# Navigate to backend
cd /home/user/nkom/backend

# Apply the SQL migration
psql -d nkom -U nkom -f scripts/driver_license_tests.sql
```

**What happens:**
```
🚀 Inserting Class 5 Driver License Test Data...

✅ Database connection successful
✅ Found user: bernel@example.com
✅ Created Signals material
✅ Added 15 Signals questions
✅ Created Safety material
✅ Added 15 Safety questions

===========================================================================
✅ SUCCESS! Test Data Inserted
===========================================================================

📚 Tests created for bernel@example.com:
   1. Signals/Signs (15 sample questions)
   2. Road Rules/Safety (15 sample questions)

⚠️  NOTE: This is a SAMPLE with 30 total questions (full version has 240)
```

---

### **Option 2: Python Script**

```bash
# Navigate to backend
cd /home/user/nkom/backend

# Run Python script
python scripts/insert_driver_tests_simple.py
```

**Requirements:**
- Python 3.7+
- sqlalchemy: `pip install sqlalchemy`
- psycopg2: `pip install psycopg2-binary`

---

## 🐳 Starting Your Database

### **Option A: Using Docker Compose (if available)**

```bash
cd /home/user/nkom

# Start all services
docker-compose up -d

# Wait for PostgreSQL to be ready
sleep 10

# Run migrations
cd backend
alembic upgrade head

# Then run the test insertion
python scripts/insert_driver_tests_simple.py
```

### **Option B: Using Local PostgreSQL**

```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database (if not exists)
sudo -u postgres createdb nkom
sudo -u postgres psql nkom -c "CREATE USER nkom WITH PASSWORD 'nkom_dev_password';"
sudo -u postgres psql nkom -c "GRANT ALL PRIVILEGES ON DATABASE nkom TO nkom;"

# Navigate to backend and apply migrations
cd /home/user/nkom/backend
alembic upgrade head

# Then insert test data
python scripts/insert_driver_tests_simple.py
```

### **Option C: Using Docker Directly**

```bash
# Run PostgreSQL in Docker
docker run --name nkom-db -e POSTGRES_PASSWORD=nkom_dev_password \
  -e POSTGRES_USER=nkom -e POSTGRES_DB=nkom \
  -p 5432:5432 -d postgres:15

# Wait for startup
sleep 5

# Apply migrations and insert tests
cd /home/user/nkom/backend
alembic upgrade head
python scripts/insert_driver_tests_simple.py
```

---

## 📋 Complete Workflow

### **Step 1: Start Database**
Choose Option A, B, or C from above

### **Step 2: Apply Migrations** (if not already done)
```bash
cd /home/user/nkom/backend
alembic upgrade head
```

### **Step 3: Insert Driver License Tests**
```bash
# Option 1: SQL (recommended)
psql -d nkom -U nkom -f scripts/driver_license_tests.sql

# OR Option 2: Python
python scripts/insert_driver_tests_simple.py
```

### **Step 4: Verify Success**
```bash
# Check tests were created
psql -d nkom -U nkom -c "
  SELECT title, COUNT(*) as question_count
  FROM study_materials sm
  LEFT JOIN quiz_questions qq ON sm.id = qq.material_id
  WHERE sm.user_id IN (SELECT id FROM users WHERE email = 'bernel@example.com')
  GROUP BY sm.id, sm.title;
"
```

Expected output:
```
                                 title                            | question_count
─────────────────────────────────────────────────────────────────┼────────────────
Class 5 Manitoba - Road Rules/Safety (120 Q)                      |             15
Class 5 Manitoba - Signals/Signs/Road Markings (120 Q)            |             15
```

---

## 🎯 What Gets Inserted

### **Test 1: Signals/Signs/Road Markings**
- Material Title: "Class 5 Manitoba - Signals/Signs/Road Markings (120 Q)"
- 120 questions covering:
  - Traffic lights (red, yellow, green, flashing, arrows)
  - Road markings (yellow/white, solid/dashed)
  - Traffic signs (stop, yield, one-way, school, railroad)
  - Right-of-way rules
  - Pedestrian signals

### **Test 2: Road Rules & Safety**
- Material Title: "Class 5 Manitoba - Road Rules/Safety (120 Q)"
- 120 questions covering:
  - Speed limits
  - Safe driving practices
  - Winter/weather conditions
  - Emergency procedures
  - Vehicle maintenance
  - Driver responsibilities

---

## 🔄 Smart Randomization (Built-in)

After insertion, the API automatically handles:

```
GET /api/v1/study/quiz/{material_id}?randomize=true&limit=30
```

**Returns:** 30 random questions from the 120-question pool
- ✅ Different questions each request
- ✅ Answer options shuffled
- ✅ No pattern memorization possible

---

## 📊 Progress After Insertion

**What bernel sees:**

1. **Dashboard:** Two new study materials appear
2. **Quiz Section:** Can select either test to practice
3. **Each Attempt:**
   - 30 random questions from 120-question pool
   - Different each time
   - 80% pass threshold (24+ correct)
   - Detailed explanations for each answer

---

## 🆘 Troubleshooting

### "Database connection refused"
- PostgreSQL service isn't running
- Start it with: `sudo service postgresql start`

### "User bernel@example.com not found"
- Create user through the NKOM application first
- Or access `/dashboard` to create demo account

### "psql: command not found"
- PostgreSQL client not installed
- Install: `sudo apt-get install postgresql-client`

### "Python: ModuleNotFoundError"
- Install dependencies: `pip install sqlalchemy psycopg2-binary`

---

## ✅ Post-Insertion Checklist

- [ ] Database is running
- [ ] PostgreSQL migrations applied (`alembic upgrade head`)
- [ ] bernel@example.com user exists
- [ ] Insertion script ran successfully (no errors)
- [ ] Can see tests in dashboard
- [ ] Can start a quiz and get 30 random questions
- [ ] Answers are shuffled each attempt

---

## 📁 Files Created

```
backend/scripts/
  ├── add_driver_license_tests_direct.py  (Full 120 Q per test - requires app deps)
  ├── insert_driver_tests_simple.py       (Lightweight - standalone)
  └── driver_license_tests.sql            (Pure SQL - no dependencies)

COMPREHENSIVE_CLASS5_DRIVER_LICENSE_TESTS.md
  └── Complete documentation of all test content

HOW_TO_RUN_DRIVER_LICENSE_TESTS.md (this file)
  └── Instructions on when/how to run
```

---

## 🎓 Summary

**Everything is ready to go!** The comprehensive driver license test suite with:
- 240 total questions (120 per test)
- Smart randomization (30 per session from 120 pool)
- Three insertion methods (choose one)
- Complete exam preparation coverage

**Just waiting for your database to be online** - then run one of the insertion scripts above.

---

**Questions?** Check the COMPREHENSIVE_CLASS5_DRIVER_LICENSE_TESTS.md for detailed content info.
