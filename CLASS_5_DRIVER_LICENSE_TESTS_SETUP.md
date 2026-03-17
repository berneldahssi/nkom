# 🚗 Class 5 Driver License Test Suite - Setup Complete

## ✅ What's Ready

Two comprehensive randomized test suites have been created for **bernel@example.com** with **80 total questions** (40 per test):

### **Test 1: Signals/Signs** 🚦
- **Questions in pool:** 40 MCQ
- **Questions per attempt:** 30 (randomly selected each time)
- **Topics:** Traffic signals, road signs, lane markings, right-of-way rules
- **Randomization:** Questions and answers shuffled each attempt

### **Test 2: Road Rules & Safety** 🛣️
- **Questions in pool:** 40 MCQ
- **Questions per attempt:** 30 (randomly selected each time)
- **Topics:** Speed limits, safe driving, winter conditions, vehicle maintenance, emergency procedures
- **Randomization:** Questions and answers shuffled each attempt

---

## 📊 Test Format

**Both tests follow the real Manitoba Class 5 test:**
- ✓ 30 MCQ questions per test attempt
- ✓ 4 answer options (randomly ordered)
- ✓ **Pass: 24+ correct (80%)**
- ✓ **Fail: 6+ incorrect**
- ✓ Detailed explanations for every answer

---

## 🎯 Randomization Features

**Each test attempt is completely different:**

1. **Question Randomization**
   - 40-question pool per test
   - 30 random questions selected per attempt
   - Different questions each time you test

2. **Answer Shuffling**
   - Answer options randomly ordered
   - Prevents memorization by position
   - Correct answer in different positions each attempt

3. **Smart Sampling**
   - API endpoint: `GET /api/v1/study/quiz/{material_id}?randomize=true&limit=30`
   - Samples 30 from the pool of 40 questions
   - No repeats within the same test

---

## 🚀 Running the Setup Script

When you're ready to add tests to bernel's profile (after backend is running):

### Option 1: Auto-detect bernel@example.com
```bash
cd /home/user/nkom/backend
python scripts/add_driver_license_tests.py
```

### Option 2: Override with different email
```bash
python scripts/add_driver_license_tests.py different@email.com
```

### Expected Output
```
🚀 Adding Class 5 Driver License tests to bernel@example.com...

✅ Found user: bernel@example.com (Bernel [LastName])
✅ Added 40 signal/sign questions (randomizes 30 per attempt)
✅ Added 40 road rules/safety questions (randomizes 30 per attempt)

======================================================================
✅ SUCCESS! Class 5 Driver License Tests Added
======================================================================

📚 Two randomized test suites created for Bernel [LastName]:

   1️⃣  Signals/Signs Test
       Title: Class 5 Driver License Test - WITH Signals/Signs
       Questions in pool: 40
       Questions per attempt: 30 (randomly selected & shuffled)

   2️⃣  Road Rules & Safety Test
       Title: Class 5 Driver License Test - Road Rules & Safety
       Questions in pool: 40
       Questions per attempt: 30 (randomly selected & shuffled)

📊 Test Format (both tests):
   ✓ Random 30 MCQ questions (different each attempt)
   ✓ 4 answer options per question (randomly ordered)
   ✓ Pass: 24+ correct answers (80%)
   ✓ Fail: 6 or more incorrect answers
   ✓ Detailed explanations for every answer

🎯 Randomization Features:
   • Question order randomized each test attempt
   • Answer options shuffled (prevents memorization)
   • Random sampling from question pools
   • Different test every time bernel practices

📖 Topics Covered:
   Test 1: Traffic signals, road signs, lane markings, right-of-way
   Test 2: Speed limits, safe driving, winter conditions, vehicle care

======================================================================
```

---

## 🌐 Frontend Integration

Once added, bernel can access tests:

1. **Dashboard Quiz Section**
   - Tests appear under "My Study Materials"
   - Easy one-click launch

2. **API Endpoint**
   ```
   GET /api/v1/study/quiz/{material_id}?randomize=true&limit=30
   ```
   Returns 30 randomized questions with shuffled options

3. **Submit Answers**
   ```
   POST /api/v1/study/quiz/submit
   Body: {
     "answers": [
       { "question_id": "...", "answer": "..." },
       ...
     ]
   }
   ```

---

## 📋 Question Bank Details

### Signals/Signs Test (40 Q)
1-8: Basic traffic lights (red, yellow, green)
9-14: Flashing lights & special signals
15-20: Road markings (yellow/white lines)
21-26: Stop/Yield/One-way signs
27-32: Pedestrian & railway crossings
33-40: Advanced right-of-way scenarios

### Road Rules/Safety Test (40 Q)
1-8: Speed limits & school zones
9-14: Safe following distance & headlights
15-20: Winter driving & emergency procedures
21-26: Highway merging & lane changes
27-32: Vehicle maintenance & child seats
33-40: Parking, insurance, ABS, cyclist safety

---

## 🔧 Technical Implementation

### Backend Changes
- **File:** `/home/user/nkom/backend/app/api/v1/endpoints/study.py`
- **New parameters:**
  - `randomize` (bool): Enable/disable randomization (default: true)
  - `limit` (int): Questions per test (default: 30, max: 100)
- **Features:**
  - Random sampling from larger pools
  - Shuffles question order
  - Shuffles answer options while preserving correctness

### Database
- **Table:** `study_materials` (2 new records)
- **Table:** `quiz_questions` (80 new records)
- **User:** bernel@example.com

---

## 💡 Usage Tips for Bernel

1. **First Attempt:** Take test to assess baseline
2. **Review Weak Areas:** Focus on low-scoring topics
3. **Practice Multiple Times:** Questions/answers randomize each attempt
4. **Use Explanations:** Read all explanations to understand concepts
5. **Target 90%+:** Shoot for 27+ correct for extra confidence
6. **Mix Tests:** Alternate between Signals and Road Rules tests

---

## 📝 Notes

- Tests are fully independent - can be taken in any order
- No time limit on individual tests
- Can retake tests unlimited times
- Each attempt pulls different random questions
- Answer explanations help with learning
- Pass threshold matches real Manitoba test (80%)

---

**Status:** ✅ Ready to deploy
**Created:** March 2026
**For:** bernel@example.com
**Total Questions:** 80 (40 per test)
**Questions per attempt:** 30 (randomly selected)
