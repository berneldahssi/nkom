# Class 5 Driver License Tests Setup Guide

## Overview

Two comprehensive 30-question MCQ tests have been created for Manitoba Class 5 Driver License preparation:

1. **Signals/Signs Test** - Focus on traffic signals, road signs, lane markings, and right-of-way rules
2. **Road Rules & Safety Test** - Focus on speed limits, safe driving techniques, winter conditions, and vehicle maintenance

### Test Format
- **30 questions each** - Multiple choice with 4 options
- **Pass requirement:** 24+ correct answers (80%)
- **Fail threshold:** 6+ incorrect answers
- **Difficulty levels:** Mix of 1-3 difficulty ratings
- **Each question includes:** Full explanation for learning

---

## How to Add Tests to Bernel's Profile

### Prerequisites
1. Backend server running with database connection
2. Bernel's user email address
3. Python 3.10+ with project dependencies installed

### Step 1: Find Bernel's Email

If bernel already has an account in NKOM, get their registered email address.

### Step 2: Run the Setup Script

From the backend directory:

```bash
cd /home/user/nkom/backend

# Run the script with bernel's email
python scripts/add_driver_license_tests.py bernel@email.example.com
```

Replace `bernel@email.example.com` with the actual registered email.

### Step 3: Verify

Once the script completes successfully, you should see:
```
============================================================
✅ SUCCESS! Class 5 Driver License Tests Added
============================================================

📚 Two tests created for Bernel [Last Name]:
   1. Signals/Signs Test: Class 5 Driver License Test - WITH Signals/Signs
   2. Road Rules Test: Class 5 Driver License Test - Road Rules & Safety

📊 Test Format:
   • 30 MCQ questions each
   • 4 answer options per question
   • Pass: 24+ correct answers (80%)
   • Fail: 6 or more incorrect answers

📖 Topics covered:
   Test 1: Traffic signals, road signs, lane markings, right-of-way
   Test 2: Speed limits, safe driving, winter conditions, vehicle care
```

---

## Test Content Summary

### Test 1: Signals/Signs (30 Questions)

**Topics covered:**
- Traffic light colors and meanings (red, yellow, green)
- Flashing lights (red, yellow, amber)
- One-way signs and directional indicators
- Yield vs. Stop signs
- Double line rules (yellow, white, solid, dashed)
- Turn signals and timing
- Pedestrian crossings
- Railway crossings
- Parking regulations
- Police direction vs. traffic signals
- Right-of-way rules
- Green arrows and red light turns

**Question examples:**
- "What does a solid yellow line on your side of the road mean?"
- "When you see a red traffic light, what must you do?"
- "What does a broken yellow line mean?"
- "A green arrow in traffic lights means..."

---

### Test 2: Road Rules & Safety (30 Questions)

**Topics covered:**
- Speed limits (residential, highway, school zones)
- Safe following distances
- Headlight management (when to use, when to dim)
- Emergency procedures (brake/steering failure, blow-outs, hydroplaning, skids)
- Winter driving techniques
- Highway merging and lane changes
- Vehicle inspection and tire maintenance
- Child car seat requirements
- Phone use while driving
- Parking on hills
- Aggressive driver responses
- Idling regulations
- Insurance basics
- Minimum driving age
- Blood alcohol limit

**Question examples:**
- "What is the maximum speed limit on residential streets in Manitoba?"
- "At what speed should you approach a school zone?"
- "What is the safe following distance at highway speeds?"
- "How should you handle a blow-out while driving?"

---

## Database Schema

The tests are stored using NKOM's quiz system:

### StudyMaterial Table
- Title, subject, and description for each test
- Links to user profile
- Difficulty level: 2
- Format: "quiz" marked as "completed"

### QuizQuestion Table
- 30 records per test
- Multiple choice format
- Contains:
  - Question text
  - 4 answer options
  - Correct answer
  - Detailed explanation
  - Difficulty rating (1-3)

---

## Access the Tests

Once added, bernel can access the tests through:

1. **Dashboard** → Quiz section
2. **Study Materials** → Find "Class 5 Driver License Tests"
3. **API Endpoint** → `GET /api/v1/study/materials` filtered by subject

---

## Questions? Need Help?

If the script doesn't work, ensure:
- [ ] Backend is running
- [ ] PostgreSQL database is connected
- [ ] Bernel's email is correct and user exists in database
- [ ] All Python dependencies are installed (`pip install -r requirements.txt`)

For issues, check the error message returned by the script.

---

**Created:** March 2026
**Test Format:** Based on Manitoba Class 5 Driver License Handbook standards
**Total Questions:** 60 (30 per test)
**Estimated Study Time:** 1-2 hours per test
