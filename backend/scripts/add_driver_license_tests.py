"""
Script to add Class 5 Driver License tests to a user's profile.
Usage: python scripts/add_driver_license_tests.py <user_email>
Example: python scripts/add_driver_license_tests.py bernel@example.com
"""

import asyncio
import sys
import uuid
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.models import StudyMaterial, QuizQuestion, User

# Questions for Class 5 Driver License Test - WITH Signals/Signs Focus
QUESTIONS_WITH_SIGNALS = [
    {
        "question": "What does a solid yellow line on your side of the road mean?",
        "options": [
            "You cannot pass other vehicles",
            "You can pass if the road is clear",
            "It indicates a school zone",
            "It marks a pedestrian crossing"
        ],
        "correct_answer": "You cannot pass other vehicles",
        "explanation": "A solid yellow line on your side means no passing is allowed.",
        "difficulty": 1
    },
    {
        "question": "When you see a red traffic light, what must you do?",
        "options": [
            "Slow down and proceed with caution",
            "Come to a complete stop",
            "Honk your horn to alert others",
            "Speed up to clear the intersection"
        ],
        "correct_answer": "Come to a complete stop",
        "explanation": "You must come to a complete stop at a red light until it turns green.",
        "difficulty": 1
    },
    {
        "question": "What does a yellow traffic light mean?",
        "options": [
            "Stop immediately",
            "The light is about to turn red, prepare to stop",
            "Proceed with caution",
            "School zone is ahead"
        ],
        "correct_answer": "The light is about to turn red, prepare to stop",
        "explanation": "Yellow indicates the light is about to turn red. Be prepared to stop safely.",
        "difficulty": 1
    },
    {
        "question": "What does a flashing red light mean at an intersection?",
        "options": [
            "Slow down and look both ways",
            "Come to a complete stop, then proceed if safe",
            "Proceed cautiously without stopping",
            "The traffic light is broken"
        ],
        "correct_answer": "Come to a complete stop, then proceed if safe",
        "explanation": "A flashing red light requires you to stop completely before proceeding.",
        "difficulty": 2
    },
    {
        "question": "What does a broken yellow line mean?",
        "options": [
            "No passing allowed",
            "Passing is allowed if safe",
            "End of road ahead",
            "Construction zone"
        ],
        "correct_answer": "Passing is allowed if safe",
        "explanation": "A broken yellow line indicates you can pass if the road is clear and safe.",
        "difficulty": 2
    },
    {
        "question": "When you see a white dashed line, what does it indicate?",
        "options": [
            "Do not cross this line",
            "You can change lanes if safe",
            "School zone warning",
            "Stop sign ahead"
        ],
        "correct_answer": "You can change lanes if safe",
        "explanation": "White dashed lines mark lane divisions where you can change lanes safely.",
        "difficulty": 2
    },
    {
        "question": "What should you do when approaching a yield sign?",
        "options": [
            "Stop completely",
            "Slow down and be prepared to stop if necessary",
            "Speed up to clear the intersection",
            "Honk your horn"
        ],
        "correct_answer": "Slow down and be prepared to stop if necessary",
        "explanation": "A yield sign means you must be ready to stop if necessary to avoid a collision.",
        "difficulty": 2
    },
    {
        "question": "A green arrow in traffic lights means:",
        "options": [
            "Proceed in any direction",
            "You have right of way to turn in the direction shown",
            "Prepare to turn when light turns red",
            "Turn without checking for traffic"
        ],
        "correct_answer": "You have right of way to turn in the direction shown",
        "explanation": "A green arrow gives you the right of way to turn in the direction indicated.",
        "difficulty": 2
    },
    {
        "question": "What does a stop sign require you to do?",
        "options": [
            "Slow down and look both ways",
            "Come to a complete stop and ensure the intersection is clear",
            "Speed up after checking",
            "Honk and proceed"
        ],
        "correct_answer": "Come to a complete stop and ensure the intersection is clear",
        "explanation": "A stop sign requires a complete stop before proceeding into the intersection.",
        "difficulty": 1
    },
    {
        "question": "When can you turn right at a red light?",
        "options": [
            "Anytime, without looking",
            "Only after coming to a complete stop and ensuring it's safe",
            "Only in the morning",
            "Never at a red light"
        ],
        "correct_answer": "Only after coming to a complete stop and ensuring it's safe",
        "explanation": "Right turns on red are allowed after stopping and confirming the path is clear.",
        "difficulty": 2
    },
    {
        "question": "What does a solid white line mean?",
        "options": [
            "No lane changing",
            "You should not cross this line except to turn",
            "Lane changing is always allowed",
            "Pedestrian crossing ahead"
        ],
        "correct_answer": "You should not cross this line except to turn",
        "explanation": "A solid white line discourages lane changes except when necessary.",
        "difficulty": 2
    },
    {
        "question": "What should you do when you see a yellow diamond-shaped sign?",
        "options": [
            "Stop immediately",
            "Pay attention as it warns of a hazard ahead",
            "Turn left",
            "Speed up to avoid danger"
        ],
        "correct_answer": "Pay attention as it warns of a hazard ahead",
        "explanation": "Yellow diamond signs warn of potential hazards or road conditions ahead.",
        "difficulty": 2
    },
    {
        "question": "At a four-way stop, who has the right of way?",
        "options": [
            "The vehicle going straight",
            "The vehicle that arrived first",
            "Large trucks",
            "Any vehicle can proceed"
        ],
        "correct_answer": "The vehicle that arrived first",
        "explanation": "At a four-way stop, the vehicle that stopped first has the right of way.",
        "difficulty": 3
    },
    {
        "question": "What does a white rectangular sign with red border mean?",
        "options": [
            "Regulatory sign",
            "Warning sign",
            "No entry",
            "One-way street"
        ],
        "correct_answer": "No entry",
        "explanation": "A white rectangular sign with red border means 'No Entry' - do not proceed.",
        "difficulty": 2
    },
    {
        "question": "When approaching a pedestrian crossing with no traffic lights, what should you do?",
        "options": [
            "Proceed normally without slowing down",
            "Slow down and be prepared to stop for pedestrians",
            "Speed up to cross before pedestrians",
            "Sound your horn to alert pedestrians"
        ],
        "correct_answer": "Slow down and be prepared to stop for pedestrians",
        "explanation": "Always slow down and be prepared to stop for pedestrians at unmarked crossings.",
        "difficulty": 2
    },
    {
        "question": "What does a flashing yellow light mean?",
        "options": [
            "Stop completely",
            "Proceed with caution after checking",
            "Turn left only",
            "School zone ahead"
        ],
        "correct_answer": "Proceed with caution after checking",
        "explanation": "A flashing yellow means proceed cautiously after checking the intersection.",
        "difficulty": 2
    },
    {
        "question": "What is the meaning of a 'Do Not Enter' sign?",
        "options": [
            "Enter slowly",
            "Do not proceed - it's illegal to enter",
            "Only for commercial vehicles",
            "One-way traffic only"
        ],
        "correct_answer": "Do not proceed - it's illegal to enter",
        "explanation": "'Do Not Enter' signs prohibit entry. Never ignore this sign.",
        "difficulty": 1
    },
    {
        "question": "When should you use your turn signal?",
        "options": [
            "Only when turning left",
            "At least 100 feet before turning or changing lanes",
            "Never, as it's optional",
            "Only at intersections"
        ],
        "correct_answer": "At least 100 feet before turning or changing lanes",
        "explanation": "Signal at least 100 feet before turning to give other drivers adequate notice.",
        "difficulty": 2
    },
    {
        "question": "What does a triangular red-bordered sign mean?",
        "options": [
            "Dangerous ahead - proceed with caution",
            "Stop sign ahead",
            "Warning of danger ahead",
            "Speed limit change"
        ],
        "correct_answer": "Warning of danger ahead",
        "explanation": "Red-bordered triangular signs warn of potential hazards or dangers.",
        "difficulty": 2
    },
    {
        "question": "How should you respond to a police officer directing traffic at an intersection?",
        "options": [
            "Ignore them and follow traffic lights",
            "Follow their directions, even if it contradicts traffic signals",
            "Stop and ask for directions",
            "Honk and proceed"
        ],
        "correct_answer": "Follow their directions, even if it contradicts traffic signals",
        "explanation": "Traffic police instructions override traffic signals and signs.",
        "difficulty": 2
    },
    {
        "question": "What does a green light mean for pedestrians?",
        "options": [
            "They may cross if no vehicles are coming",
            "They have the right of way to cross",
            "They must wait for a walk signal",
            "They can cross against traffic"
        ],
        "correct_answer": "They have the right of way to cross",
        "explanation": "A green light gives pedestrians the right of way to cross the street safely.",
        "difficulty": 1
    },
    {
        "question": "When two vehicles arrive at a stop sign simultaneously, what's the rule?",
        "options": [
            "The one on the left goes first",
            "The one on the right goes first",
            "Both can go at the same time",
            "The larger vehicle goes first"
        ],
        "correct_answer": "The one on the right goes first",
        "explanation": "When two vehicles arrive simultaneously, the vehicle on the right has priority.",
        "difficulty": 3
    },
    {
        "question": "What is a white line used for on roads?",
        "options": [
            "Only separating directions of traffic",
            "Separating lanes going in the same direction or edge lines",
            "Pedestrian crossing only",
            "Parking zones"
        ],
        "correct_answer": "Separating lanes going in the same direction or edge lines",
        "explanation": "White lines separate traffic going in the same direction.",
        "difficulty": 2
    },
    {
        "question": "What does a 'One Way' sign indicate?",
        "options": [
            "Traffic flows in only one direction on this street",
            "You must turn in one direction",
            "Limited parking",
            "No U-turns allowed"
        ],
        "correct_answer": "Traffic flows in only one direction on this street",
        "explanation": "A 'One Way' sign means traffic is permitted in only one direction on that street.",
        "difficulty": 1
    },
    {
        "question": "When you see a bus with its turn signal on, what should you do?",
        "options": [
            "Honk at it to move faster",
            "Give it space and allow it to change lanes or turn",
            "Pass it immediately",
            "Follow closely behind it"
        ],
        "correct_answer": "Give it space and allow it to change lanes or turn",
        "explanation": "Always give buses room to maneuver, especially when they signal a turn.",
        "difficulty": 2
    },
    {
        "question": "What does a red light with a green arrow mean?",
        "options": [
            "You cannot turn",
            "You can turn in the direction of the arrow only",
            "You can go in any direction",
            "Turn slowly"
        ],
        "correct_answer": "You can turn in the direction of the arrow only",
        "explanation": "A green arrow on a red light allows a turn only in the direction shown.",
        "difficulty": 2
    },
    {
        "question": "When approaching a railway crossing with red lights flashing, what should you do?",
        "options": [
            "Speed up to cross before the train",
            "Stop at least 5 meters from the nearest rail",
            "Shift to neutral and coast across",
            "Back up and find another route"
        ],
        "correct_answer": "Stop at least 5 meters from the nearest rail",
        "explanation": "Flashing red lights at railway crossings mean you must stop at a safe distance.",
        "difficulty": 2
    },
    {
        "question": "What is the proper way to make a three-point turn (U-turn)?",
        "options": [
            "Any way that's quickest",
            "Check mirrors, signal, move to the right, back up, move forward across",
            "Make it on any street",
            "Only in residential areas"
        ],
        "correct_answer": "Check mirrors, signal, move to the right, back up, move forward across",
        "explanation": "A three-point turn requires signaling, checking mirrors, and careful maneuvering.",
        "difficulty": 3
    },
    {
        "question": "What should you do if a traffic signal is malfunctioning?",
        "options": [
            "Proceed as if it's green",
            "Treat it as a four-way stop and use caution",
            "Honk and proceed",
            "Back up and take another route"
        ],
        "correct_answer": "Treat it as a four-way stop and use caution",
        "explanation": "A broken signal should be treated as a four-way stop for safety.",
        "difficulty": 2
    },
    {
        "question": "When should your vehicle's headlights be on?",
        "options": [
            "Only at night",
            "Only in fog",
            "When visibility is reduced or between sunset and sunrise",
            "Never during the day"
        ],
        "correct_answer": "When visibility is reduced or between sunset and sunrise",
        "explanation": "Headlights must be on whenever visibility is poor or between sunset and sunrise.",
        "difficulty": 2
    }
]

# Questions for Class 5 Driver License Test - WITHOUT Signals/Signs Focus
QUESTIONS_WITHOUT_SIGNALS = [
    {
        "question": "What is the maximum speed limit on residential streets in Manitoba?",
        "options": [
            "40 km/h",
            "50 km/h",
            "60 km/h",
            "80 km/h"
        ],
        "correct_answer": "50 km/h",
        "explanation": "The standard speed limit in residential areas is 50 km/h unless otherwise posted.",
        "difficulty": 1
    },
    {
        "question": "At what speed should you approach a school zone?",
        "options": [
            "Slow down to 20-30 km/h",
            "Maintain normal speed",
            "Speed does not matter in school zones",
            "Speed up to clear the area quickly"
        ],
        "correct_answer": "Slow down to 20-30 km/h",
        "explanation": "School zones require reduced speed to protect children.",
        "difficulty": 1
    },
    {
        "question": "What is the safe following distance at highway speeds?",
        "options": [
            "2 seconds behind the vehicle ahead",
            "1 second behind the vehicle ahead",
            "Less than 1 second",
            "No specific distance required"
        ],
        "correct_answer": "2 seconds behind the vehicle ahead",
        "explanation": "Maintain at least 2 seconds of distance between your vehicle and the one ahead.",
        "difficulty": 2
    },
    {
        "question": "When should you dim your headlights?",
        "options": [
            "Only when you see oncoming traffic",
            "When you're within 150 meters of an oncoming vehicle",
            "Never, bright lights are safer",
            "Only on residential streets"
        ],
        "correct_answer": "When you're within 150 meters of an oncoming vehicle",
        "explanation": "Dim headlights to avoid blinding oncoming drivers at approximately 150 meters.",
        "difficulty": 2
    },
    {
        "question": "What should you do if your brakes fail while driving?",
        "options": [
            "Panic and steer randomly",
            "Pump the brakes, shift to neutral, and use the emergency brake",
            "Speed up to get to a safer location",
            "Continue and hope it improves"
        ],
        "correct_answer": "Pump the brakes, shift to neutral, and use the emergency brake",
        "explanation": "If brakes fail, pump them, shift to neutral, and gradually use the emergency brake.",
        "difficulty": 3
    },
    {
        "question": "How far ahead should you scan the road while driving?",
        "options": [
            "10 meters",
            "12-15 seconds ahead (about 250 meters at highway speed)",
            "Only at the vehicle directly ahead",
            "As far as street lights allow"
        ],
        "correct_answer": "12-15 seconds ahead (about 250 meters at highway speed)",
        "explanation": "Good drivers look 12-15 seconds ahead to anticipate hazards.",
        "difficulty": 2
    },
    {
        "question": "When driving in fog, what should you do?",
        "options": [
            "Increase speed to get through it faster",
            "Use low beam headlights and reduce speed",
            "Use high beams for better visibility",
            "Turn off lights to reduce glare"
        ],
        "correct_answer": "Use low beam headlights and reduce speed",
        "explanation": "In fog, use low beams and reduce speed for safety.",
        "difficulty": 2
    },
    {
        "question": "What is the legal alcohol limit for driving in Manitoba?",
        "options": [
            "0.08%",
            "0.05%",
            "0% for drivers under 21",
            "Any amount is illegal"
        ],
        "correct_answer": "0.08%",
        "explanation": "The legal limit is 0.08% blood alcohol content for regular drivers.",
        "difficulty": 1
    },
    {
        "question": "How should you respond to aggressive drivers?",
        "options": [
            "Match their aggression",
            "Ignore them and maintain safe driving",
            "Speed up to get away",
            "Honk and gesture at them"
        ],
        "correct_answer": "Ignore them and maintain safe driving",
        "explanation": "Never engage with aggressive drivers. Maintain focus on safe driving.",
        "difficulty": 2
    },
    {
        "question": "What should you do if your vehicle starts to skid on ice?",
        "options": [
            "Slam on the brakes",
            "Steer in the direction you want the front to go and ease off the accelerator",
            "Turn the steering wheel sharply",
            "Accelerate to regain traction"
        ],
        "correct_answer": "Steer in the direction you want the front to go and ease off the accelerator",
        "explanation": "In a skid, steer gently in the direction needed and reduce throttle.",
        "difficulty": 3
    },
    {
        "question": "How long can you leave your engine running while parked?",
        "options": [
            "As long as you want",
            "No more than 5 minutes in residential areas",
            "Only in extreme weather",
            "Indefinitely if the vehicle is empty"
        ],
        "correct_answer": "No more than 5 minutes in residential areas",
        "explanation": "Idling is often limited to reduce pollution in residential areas.",
        "difficulty": 2
    },
    {
        "question": "What is the proper way to carry a child in a vehicle?",
        "options": [
            "On the driver's lap",
            "In a booster seat according to weight and age guidelines",
            "In the back seat without restraints",
            "In the front passenger seat with airbags"
        ],
        "correct_answer": "In a booster seat according to weight and age guidelines",
        "explanation": "Children must be in appropriate car seats based on their age and weight.",
        "difficulty": 2
    },
    {
        "question": "When parking on a hill, which direction should your wheels point?",
        "options": [
            "Straight ahead",
            "Toward the curb if downhill; away from curb if uphill",
            "It doesn't matter",
            "Always toward traffic"
        ],
        "correct_answer": "Toward the curb if downhill; away from curb if uphill",
        "explanation": "On hills, position wheels to prevent rolling in case of brake failure.",
        "difficulty": 2
    },
    {
        "question": "How should you handle a blow-out while driving?",
        "options": [
            "Slam on the brakes immediately",
            "Remain calm, ease off the gas, and steer carefully to safety",
            "Swerve to the other lane",
            "Speed up to get to a repair shop"
        ],
        "correct_answer": "Remain calm, ease off the gas, and steer carefully to safety",
        "explanation": "In a blow-out, stay calm and steer to a safe location while slowing gradually.",
        "difficulty": 2
    },
    {
        "question": "What is the minimum age to drive in Manitoba?",
        "options": [
            "15 years",
            "16 years",
            "17 years",
            "18 years"
        ],
        "correct_answer": "16 years",
        "explanation": "The minimum driving age in Manitoba is 16 years old.",
        "difficulty": 1
    },
    {
        "question": "How often should you have your vehicle inspected?",
        "options": [
            "Once a year",
            "Every 2 years",
            "Only when it breaks down",
            "Every 5 years"
        ],
        "correct_answer": "Once a year",
        "explanation": "Annual vehicle inspections are required in Manitoba.",
        "difficulty": 1
    },
    {
        "question": "What should you do if your steering fails while driving?",
        "options": [
            "Remain calm and gradually slow down by pumping the brakes",
            "Panic and turn the wheel hard",
            "Speed up to get to help faster",
            "Shift to park"
        ],
        "correct_answer": "Remain calm and gradually slow down by pumping the brakes",
        "explanation": "Steering failure requires calm, gradual deceleration to prevent loss of control.",
        "difficulty": 3
    },
    {
        "question": "What is the proper way to merge on a highway?",
        "options": [
            "Cut across multiple lanes at once",
            "Signal, check mirrors and blind spots, accelerate to match traffic speed",
            "Stop and wait for a gap",
            "Merge slowly without signaling"
        ],
        "correct_answer": "Signal, check mirrors and blind spots, accelerate to match traffic speed",
        "explanation": "Safe merging requires signaling, checking, and matching the traffic flow.",
        "difficulty": 2
    },
    {
        "question": "How should you handle a tire blow-out on the highway?",
        "options": [
            "Brake hard and stop immediately",
            "Grip the wheel firmly, ease off the gas, and gradually slow down",
            "Swerve to avoid hitting debris",
            "Shift to neutral"
        ],
        "correct_answer": "Grip the wheel firmly, ease off the gas, and gradually slow down",
        "explanation": "Stay in control by gripping the wheel and slowing gradually.",
        "difficulty": 2
    },
    {
        "question": "What should you do before starting your vehicle in winter?",
        "options": [
            "Nothing special",
            "Let it warm up for several minutes and clear windows/mirrors",
            "Start immediately to save fuel",
            "Idle for 30 seconds only"
        ],
        "correct_answer": "Let it warm up for several minutes and clear windows/mirrors",
        "explanation": "Winter driving requires warming the engine and ensuring clear visibility.",
        "difficulty": 1
    },
    {
        "question": "When turning, which way should your wheels be pointed if you must leave your vehicle?",
        "options": [
            "Straight ahead",
            "Into the curb",
            "Toward traffic",
            "Away from traffic"
        ],
        "correct_answer": "Into the curb",
        "explanation": "Point wheels toward the curb to prevent rolling into traffic.",
        "difficulty": 2
    },
    {
        "question": "What is the proper tire pressure for most passenger vehicles?",
        "options": [
            "Always 32 PSI",
            "Check the placard on the driver's door for the correct pressure",
            "The pressure on the tire sidewall",
            "Between 20-25 PSI"
        ],
        "correct_answer": "Check the placard on the driver's door for the correct pressure",
        "explanation": "Correct tire pressure is specified on the driver's door placard, not the sidewall.",
        "difficulty": 2
    },
    {
        "question": "How should you react if you begin to hydroplane?",
        "options": [
            "Brake hard and steer toward safety",
            "Remain calm, ease off the gas, and steer straight",
            "Accelerate to regain traction",
            "Turn sharply"
        ],
        "correct_answer": "Remain calm, ease off the gas, and steer straight",
        "explanation": "In hydroplaning, reduce speed and steer straight until traction returns.",
        "difficulty": 2
    },
    {
        "question": "What is the purpose of vehicle insurance?",
        "options": [
            "To avoid paying for repairs",
            "To cover costs from accidents and protect others from liability",
            "Only required for commercial vehicles",
            "To reduce your gas costs"
        ],
        "correct_answer": "To cover costs from accidents and protect others from liability",
        "explanation": "Insurance covers accident costs and provides liability protection.",
        "difficulty": 1
    },
    {
        "question": "How far should you travel before using a cell phone hands-free?",
        "options": [
            "5 minutes",
            "10 minutes",
            "You should only use hands-free devices while driving",
            "Cell phones cannot be used while driving"
        ],
        "correct_answer": "You should only use hands-free devices while driving",
        "explanation": "Always use hands-free phone systems. Never hold a phone while driving.",
        "difficulty": 1
    },
    {
        "question": "What should you do if another vehicle pulls out in front of you?",
        "options": [
            "Honk and swerve aggressively",
            "Brake firmly and try to avoid collision",
            "Speed up to hit them",
            "Do nothing and continue"
        ],
        "correct_answer": "Brake firmly and try to avoid collision",
        "explanation": "Brake and take evasive action to avoid collisions.",
        "difficulty": 2
    },
    {
        "question": "How often should you check your tire tread depth?",
        "options": [
            "Monthly",
            "Every 3 months",
            "Once a year",
            "When they look worn"
        ],
        "correct_answer": "Monthly",
        "explanation": "Check tire tread regularly, at least monthly, for safety.",
        "difficulty": 2
    },
    {
        "question": "What is the correct way to check your mirror while driving?",
        "options": [
            "Turn your head significantly to look",
            "Quick glances in mirrors without losing focus on the road",
            "Stare at the mirror for extended periods",
            "Only check mirrors before turning"
        ],
        "correct_answer": "Quick glances in mirrors without losing focus on the road",
        "explanation": "Use quick mirror glances while maintaining road awareness.",
        "difficulty": 2
    },
    {
        "question": "In Manitoba, what is the maximum speed limit on a highway unless posted otherwise?",
        "options": [
            "80 km/h",
            "100 km/h",
            "110 km/h",
            "120 km/h"
        ],
        "correct_answer": "110 km/h",
        "explanation": "The standard highway speed limit is 110 km/h unless otherwise posted.",
        "difficulty": 1
    }
]


async def add_driver_license_tests(email: str):
    """Add Class 5 Driver License tests to user's profile."""

    # Create async engine
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            # Find user by email
            from sqlalchemy import select
            stmt = select(User).where(User.email == email)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()

            if not user:
                print(f"❌ User not found: {email}")
                return False

            print(f"✅ Found user: {user.email} ({user.first_name} {user.last_name})")

            # Create StudyMaterial for test WITH signals
            material_with_signals = StudyMaterial(
                id=uuid.uuid4(),
                user_id=user.id,
                title="Class 5 Driver License Test - WITH Signals/Signs",
                subject="Manitoba Driver License - Signals & Signs",
                description="30-question MCQ test focusing on traffic signals, signs, and road markings. Pass with 24+ correct answers (80%). Based on Manitoba Class 5 driving handbook.",
                source_type="other",
                difficulty_level=2,
                generated_formats={"quiz": "completed"},
            )
            session.add(material_with_signals)
            await session.flush()

            # Add quiz questions for signals test
            for q in QUESTIONS_WITH_SIGNALS:
                question = QuizQuestion(
                    id=uuid.uuid4(),
                    material_id=material_with_signals.id,
                    question_text=q["question"],
                    question_type="multiple_choice",
                    options=q["options"],
                    correct_answer=q["correct_answer"],
                    explanation=q["explanation"],
                    difficulty=q["difficulty"],
                )
                session.add(question)

            print(f"✅ Added {len(QUESTIONS_WITH_SIGNALS)} questions to 'WITH Signals/Signs' test")

            # Create StudyMaterial for test WITHOUT signals focus
            material_without_signals = StudyMaterial(
                id=uuid.uuid4(),
                user_id=user.id,
                title="Class 5 Driver License Test - Road Rules & Safety",
                subject="Manitoba Driver License - Road Rules & Safety",
                description="30-question MCQ test focusing on speed limits, safe driving, vehicle maintenance, and emergency procedures. Pass with 24+ correct answers (80%). Based on Manitoba Class 5 driving handbook.",
                source_type="other",
                difficulty_level=2,
                generated_formats={"quiz": "completed"},
            )
            session.add(material_without_signals)
            await session.flush()

            # Add quiz questions for safety test
            for q in QUESTIONS_WITHOUT_SIGNALS:
                question = QuizQuestion(
                    id=uuid.uuid4(),
                    material_id=material_without_signals.id,
                    question_text=q["question"],
                    question_type="multiple_choice",
                    options=q["options"],
                    correct_answer=q["correct_answer"],
                    explanation=q["explanation"],
                    difficulty=q["difficulty"],
                )
                session.add(question)

            print(f"✅ Added {len(QUESTIONS_WITHOUT_SIGNALS)} questions to 'Road Rules & Safety' test")

            # Commit all changes
            await session.commit()

            print("\n" + "="*60)
            print("✅ SUCCESS! Class 5 Driver License Tests Added")
            print("="*60)
            print(f"\n📚 Two tests created for {user.first_name} {user.last_name}:")
            print(f"   1. Signals/Signs Test: {material_with_signals.title}")
            print(f"   2. Road Rules Test: {material_without_signals.title}")
            print(f"\n📊 Test Format:")
            print(f"   • 30 MCQ questions each")
            print(f"   • 4 answer options per question")
            print(f"   • Pass: 24+ correct answers (80%)")
            print(f"   • Fail: 6 or more incorrect answers")
            print(f"\n📖 Topics covered:")
            print(f"   Test 1: Traffic signals, road signs, lane markings, right-of-way")
            print(f"   Test 2: Speed limits, safe driving, winter conditions, vehicle care")
            print("\n" + "="*60)

            return True

        except Exception as e:
            print(f"❌ Error: {e}")
            await session.rollback()
            return False
        finally:
            await engine.dispose()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/add_driver_license_tests.py <user_email>")
        print("Example: python scripts/add_driver_license_tests.py bernel@example.com")
        sys.exit(1)

    email = sys.argv[1]
    success = asyncio.run(add_driver_license_tests(email))
    sys.exit(0 if success else 1)
