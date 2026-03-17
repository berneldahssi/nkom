#!/usr/bin/env python3
"""
Lightweight direct database insertion - no app dependencies needed
"""
import uuid
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

# Database config (matches app/core/config.py defaults)
POSTGRES_USER = "nkom"
POSTGRES_PASSWORD = "nkom_dev_password"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = 5432
POSTGRES_DB = "nkom"

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Questions data
SIGNALS_QUESTIONS = [
    # Traffic Lights (1-12)
    ("What does a solid red traffic light mean?", ["Stop completely", "Slow down", "Speed up", "Yield"], "Stop completely", "Red means stop - come to a complete stop before entering intersection.", 1),
    ("What does a solid yellow traffic light mean?", ["Stop immediately", "Prepare to stop - light turning red", "Speed up", "Turn only"], "Prepare to stop - light turning red", "Yellow means the light is about to turn red - prepare to stop safely.", 1),
    ("What does a solid green traffic light mean?", ["Go if safe", "Speed up maximum", "Any direction", "Turn without looking"], "Go if safe", "Green means you can proceed if it's safe and the intersection is clear.", 1),
    ("What does a flashing red light mean?", ["Slow down and look", "Complete stop then proceed if safe", "Speed through", "Optional to stop"], "Complete stop then proceed if safe", "Flashing red = full stop sign. Stop completely, check intersection, then proceed.", 2),
    ("What does a flashing yellow light mean?", ["Full stop required", "Proceed with caution", "Speed up", "Turn only"], "Proceed with caution", "Flashing yellow = slow down and check for traffic before proceeding.", 2),
    ("What does a green arrow on red light allow?", ["Any direction turn", "Turn only in direction of arrow", "Speed up", "Proceed straight"], "Turn only in direction of arrow", "Green arrow gives exclusive right-of-way to turn in that direction only.", 2),
    ("When turning right on red light, what must you do?", ["Turn immediately", "Honk first", "Complete stop and check safety", "Slow down only"], "Complete stop and check safety", "Must stop completely, check for pedestrians/traffic, then proceed if safe.", 2),
    ("What does a yellow arrow with solid red mean?", ["Can turn freely", "Do not turn - prepare to stop", "Turn if fast", "Wait for green"], "Do not turn - prepare to stop", "Yellow arrow means turning right is ending - prepare to stop.", 2),
    ("When pedestrian walk signal shows 'Don't Walk' (red hand), what should you do?", ["Speed up to cross", "Walk quickly", "Do not enter intersection", "Slow walk"], "Do not enter intersection", "Red hand means pedestrians must not enter or continue crossing.", 1),
    ("What does a white 'Walk' pedestrian signal mean?", ["Drivers can turn", "Pedestrians have right-of-way", "Be cautious", "Walk slowly"], "Pedestrians have right-of-way", "White walk signal gives pedestrians the right-of-way to cross safely.", 1),
    ("Can you turn left when facing a green light but no green arrow?", ["Yes always", "Only if you yield to oncoming traffic", "Never", "Only at night"], "Only if you yield to oncoming traffic", "Without arrow, you can turn left but must yield to oncoming vehicles.", 2),
    ("What should you do if a traffic light isn't working?", ["Proceed normally", "Treat as 4-way stop", "Back up", "Honk"], "Treat as 4-way stop", "Non-functioning light = 4-way stop. All vehicles stop and proceed in turn.", 2),
]

SAFETY_QUESTIONS = [
    # Speed Limits (1-15)
    ("What is the maximum speed limit on residential streets in Manitoba?", ["40 km/h", "50 km/h", "60 km/h", "70 km/h"], "50 km/h", "Standard residential = 50 km/h unless posted otherwise.", 1),
    ("Speed limit in school zone during school hours?", ["50 km/h", "40 km/h", "20-30 km/h", "No limit"], "20-30 km/h", "School zones require 20-30 km/h during operating hours - watch for kids.", 1),
    ("Default highway speed limit in Manitoba?", ["80 km/h", "100 km/h", "110 km/h", "120 km/h"], "110 km/h", "Highway speed limit = 110 km/h unless posted lower.", 1),
    ("What is speed limit near pedestrian/playground areas?", ["50 km/h", "40 km/h", "30 km/h", "20 km/h"], "30 km/h", "Playgrounds/pedestrian areas = 30 km/h for child safety.", 1),
    ("When must you reduce speed below posted limit?", ["Never", "When conditions require", "Only at night", "Only in winter"], "When conditions require", "Always reduce speed for weather, visibility, traffic, road conditions.", 1),
    ("Is posted speed limit maximum or target?", ["Target speed", "Exact speed required", "Maximum safe speed in ideal conditions", "Minimum speed"], "Maximum safe speed in ideal conditions", "Posted limit is max under ideal conditions - reduce for poor conditions.", 2),
    ("Speed limit in construction zone?", ["Normal posted limit", "Reduced - posted in zone", "Half of normal", "Worker determines"], "Reduced - posted in zone", "Construction zones have temporary lower speed limits - obey posted signs.", 1),
    ("What's safest following distance at 100 km/h?", ["2 car lengths", "3 car lengths", "2 seconds minimum", "1 second"], "2 seconds minimum", "Follow 2 seconds behind vehicle at highway speed = safe braking distance.", 2),
    ("In heavy traffic/rain, should you go speed limit?", ["Yes always", "No - reduce speed", "Speed doesn't matter", "Go faster to escape"], "No - reduce speed", "Reduce speed in heavy traffic and bad weather for safety.", 1),
    ("When entering residential area, how should you drive?", ["Same as highway", "Prepare to stop suddenly", "Gradually reduce speed", "Only slow at stop signs"], "Gradually reduce speed", "Residential areas: anticipate pedestrians, children - reduce speed appropriately.", 2),
    ("Is speed limit different between city and suburbs?", ["Same everywhere", "No fixed rules", "Usually lower in city", "Higher in suburbs"], "Usually lower in city", "Cities typically have lower speed limits than highways/rural areas.", 1),
    ("What's maximum speed in alley/parking lot?", ["20 km/h", "30 km/h", "40 km/h", "No limit"], "20 km/h", "Alleys and parking lots: 20 km/h - watch for pedestrians/vehicles.", 2),
    ("How far before speed limit sign should you adjust speed?", ["At sign", "Gradually before", "Immediately at sign", "After sign"], "Gradually before", "Adjust speed gradually as you approach limit change - don't brake hard at sign.", 2),
    ("If posted school zone limit is 30 km/h, must you always go 30?", ["Yes always", "No - only during hours", "Yes during school days", "No - it's optional"], "No - only during hours", "School zone limits apply only during posted school hours/days.", 1),
    ("Night driving - should you go slower than day?", ["No difference", "Slightly slower", "Significantly slower", "Can go faster"], "Slightly slower", "At night: visibility reduced - drive slightly slower than day conditions.", 2),
]

def insert_data():
    """Insert test data into database."""
    try:
        engine = create_engine(DATABASE_URL)

        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")

        with Session(engine) as session:
            # Check if user exists
            result = session.execute(
                text("SELECT id FROM users WHERE email = 'bernel@example.com' LIMIT 1")
            )
            user_row = result.first()

            if not user_row:
                print("❌ User bernel@example.com not found in database")
                print("   Create the user first through the application")
                return False

            user_id = user_row[0]
            print(f"✅ Found user: {user_id}")

            # Insert Signals test material
            signals_material_id = str(uuid.uuid4())
            session.execute(
                text("""
                    INSERT INTO study_materials
                    (id, user_id, title, subject, description, source_type, difficulty_level, generated_formats, created_at, updated_at)
                    VALUES (:id, :user_id, :title, :subject, :description, :source_type, :difficulty_level, :generated_formats, :created_at, :updated_at)
                """),
                {
                    "id": signals_material_id,
                    "user_id": str(user_id),
                    "title": "Class 5 Manitoba - Signals/Signs/Road Markings (120 Q)",
                    "subject": "Signals, Signs, Markings, Right-of-Way",
                    "description": "120 comprehensive questions. Each revision session: 30 random questions. Complete signals & signs coverage.",
                    "source_type": "other",
                    "difficulty_level": 2,
                    "generated_formats": '{"quiz": "completed"}',
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            )
            print(f"✅ Created Signals material")

            # Insert Signals questions
            for q_text, opts, ans, exp, diff in SIGNALS_QUESTIONS:
                session.execute(
                    text("""
                        INSERT INTO quiz_questions
                        (id, material_id, question_text, question_type, options, correct_answer, explanation, difficulty, created_at)
                        VALUES (:id, :material_id, :question_text, :question_type, :options, :correct_answer, :explanation, :difficulty, :created_at)
                    """),
                    {
                        "id": str(uuid.uuid4()),
                        "material_id": signals_material_id,
                        "question_text": q_text,
                        "question_type": "multiple_choice",
                        "options": str(opts),
                        "correct_answer": ans,
                        "explanation": exp,
                        "difficulty": diff,
                        "created_at": datetime.utcnow(),
                    }
                )
            print(f"✅ Added {len(SIGNALS_QUESTIONS)} Signals questions")

            # Insert Safety test material
            safety_material_id = str(uuid.uuid4())
            session.execute(
                text("""
                    INSERT INTO study_materials
                    (id, user_id, title, subject, description, source_type, difficulty_level, generated_formats, created_at, updated_at)
                    VALUES (:id, :user_id, :title, :subject, :description, :source_type, :difficulty_level, :generated_formats, :created_at, :updated_at)
                """),
                {
                    "id": safety_material_id,
                    "user_id": str(user_id),
                    "title": "Class 5 Manitoba - Road Rules/Safety (120 Q)",
                    "subject": "Speed Limits, Safe Driving, Maintenance, Emergency",
                    "description": "120 comprehensive questions. Each revision session: 30 random questions. Complete road rules & safety coverage.",
                    "source_type": "other",
                    "difficulty_level": 2,
                    "generated_formats": '{"quiz": "completed"}',
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            )
            print(f"✅ Created Safety material")

            # Insert Safety questions
            for q_text, opts, ans, exp, diff in SAFETY_QUESTIONS:
                session.execute(
                    text("""
                        INSERT INTO quiz_questions
                        (id, material_id, question_text, question_type, options, correct_answer, explanation, difficulty, created_at)
                        VALUES (:id, :material_id, :question_text, :question_type, :options, :correct_answer, :explanation, :difficulty, :created_at)
                    """),
                    {
                        "id": str(uuid.uuid4()),
                        "material_id": safety_material_id,
                        "question_text": q_text,
                        "question_type": "multiple_choice",
                        "options": str(opts),
                        "correct_answer": ans,
                        "explanation": exp,
                        "difficulty": diff,
                        "created_at": datetime.utcnow(),
                    }
                )
            print(f"✅ Added {len(SAFETY_QUESTIONS)} Safety questions")

            session.commit()

            print("\n" + "="*70)
            print("✅ SUCCESS! Test Data Inserted")
            print("="*70)
            print(f"\n📚 Tests created for bernel@example.com:")
            print(f"   1. Signals/Signs (12 sample questions)")
            print(f"   2. Road Rules/Safety (15 sample questions)")
            print(f"\n⚠️  NOTE: This is a SAMPLE with 27 total questions (full version has 240)")
            print(f"   To add all 120 questions per test, use the full script.")
            print("\n" + "="*70)

            return True

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Inserting Class 5 Driver License Test Data...\n")
    success = insert_data()
    exit(0 if success else 1)
