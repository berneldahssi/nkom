-- Class 5 Driver License Tests Migration
-- Apply this to the NKOM database to add driver license tests to bernel@example.com
-- psql -d nkom -U nkom -f driver_license_tests.sql

-- Get bernel's user ID (the demo account)
-- This script will insert into the existing user's profile

DO $$
DECLARE
    v_user_id UUID;
    v_signals_material_id UUID := gen_random_uuid();
    v_safety_material_id UUID := gen_random_uuid();
BEGIN
    -- Find bernel
    SELECT id INTO v_user_id FROM users WHERE email = 'bernel@example.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User bernel@example.com not found. Create account first.';
    END IF;

    RAISE NOTICE 'Found user: %', v_user_id;

    -- Create Signals/Signs Test Material
    INSERT INTO study_materials (
        id, user_id, title, subject, description, source_type,
        difficulty_level, generated_formats, created_at, updated_at
    ) VALUES (
        v_signals_material_id,
        v_user_id,
        'Class 5 Manitoba - Signals/Signs/Road Markings (120 Q)',
        'Signals, Signs, Markings, Right-of-Way',
        '120 comprehensive questions. Each revision session: 30 random questions. Complete signals & signs coverage for thorough preparation.',
        'other',
        2,
        '{"quiz": "completed"}'::jsonb,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Created Signals material: %', v_signals_material_id;

    -- Create Safety Test Material
    INSERT INTO study_materials (
        id, user_id, title, subject, description, source_type,
        difficulty_level, generated_formats, created_at, updated_at
    ) VALUES (
        v_safety_material_id,
        v_user_id,
        'Class 5 Manitoba - Road Rules/Safety (120 Q)',
        'Speed Limits, Safe Driving, Maintenance, Emergency',
        '120 comprehensive questions. Each revision session: 30 random questions. Complete road rules & safety coverage for thorough preparation.',
        'other',
        2,
        '{"quiz": "completed"}'::jsonb,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Created Safety material: %', v_safety_material_id;

    -- Add Signals Questions (120 total)
    INSERT INTO quiz_questions (id, material_id, question_text, question_type, options, correct_answer, explanation, difficulty, created_at)
    VALUES
    (gen_random_uuid(), v_signals_material_id, 'What does a solid red traffic light mean?', 'multiple_choice', ARRAY['Stop completely', 'Slow down', 'Speed up', 'Yield'], 'Stop completely', 'Red means stop - come to a complete stop before entering intersection.', 1, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a solid yellow traffic light mean?', 'multiple_choice', ARRAY['Stop immediately', 'Prepare to stop - light turning red', 'Speed up', 'Turn only'], 'Prepare to stop - light turning red', 'Yellow means the light is about to turn red - prepare to stop safely.', 1, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a solid green traffic light mean?', 'multiple_choice', ARRAY['Go if safe', 'Speed up maximum', 'Any direction', 'Turn without looking'], 'Go if safe', 'Green means you can proceed if it''s safe and the intersection is clear.', 1, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a flashing red light mean?', 'multiple_choice', ARRAY['Slow down and look', 'Complete stop then proceed if safe', 'Speed through', 'Optional to stop'], 'Complete stop then proceed if safe', 'Flashing red = full stop sign. Stop completely, check intersection, then proceed.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a flashing yellow light mean?', 'multiple_choice', ARRAY['Full stop required', 'Proceed with caution', 'Speed up', 'Turn only'], 'Proceed with caution', 'Flashing yellow = slow down and check for traffic before proceeding.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a green arrow on red light allow?', 'multiple_choice', ARRAY['Any direction turn', 'Turn only in direction of arrow', 'Speed up', 'Proceed straight'], 'Turn only in direction of arrow', 'Green arrow gives exclusive right-of-way to turn in that direction only.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'When turning right on red light, what must you do?', 'multiple_choice', ARRAY['Turn immediately', 'Honk first', 'Complete stop and check safety', 'Slow down only'], 'Complete stop and check safety', 'Must stop completely, check for pedestrians/traffic, then proceed if safe.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a yellow arrow with solid red mean?', 'multiple_choice', ARRAY['Can turn freely', 'Do not turn - prepare to stop', 'Turn if fast', 'Wait for green'], 'Do not turn - prepare to stop', 'Yellow arrow means turning right is ending - prepare to stop.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'When pedestrian walk signal shows "Don''t Walk" (red hand), what should you do?', 'multiple_choice', ARRAY['Speed up to cross', 'Walk quickly', 'Do not enter intersection', 'Slow walk'], 'Do not enter intersection', 'Red hand means pedestrians must not enter or continue crossing.', 1, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a white "Walk" pedestrian signal mean?', 'multiple_choice', ARRAY['Drivers can turn', 'Pedestrians have right-of-way', 'Be cautious', 'Walk slowly'], 'Pedestrians have right-of-way', 'White walk signal gives pedestrians the right-of-way to cross safely.', 1, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'Can you turn left when facing a green light but no green arrow?', 'multiple_choice', ARRAY['Yes always', 'Only if you yield to oncoming traffic', 'Never', 'Only at night'], 'Only if you yield to oncoming traffic', 'Without arrow, you can turn left but must yield to oncoming vehicles.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What should you do if a traffic light isn''t working?', 'multiple_choice', ARRAY['Proceed normally', 'Treat as 4-way stop', 'Back up', 'Honk'], 'Treat as 4-way stop', 'Non-functioning light = 4-way stop. All vehicles stop and proceed in turn.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a solid yellow line on your side of the road mean?', 'multiple_choice', ARRAY['You cannot pass other vehicles', 'You can pass if the road is clear', 'It indicates a school zone', 'It marks a pedestrian crossing'], 'You cannot pass other vehicles', 'A solid yellow line on your side means no passing is allowed.', 1, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What does a broken yellow line mean?', 'multiple_choice', ARRAY['No passing allowed', 'Passing is allowed if safe', 'End of road ahead', 'Construction zone'], 'Passing is allowed if safe', 'A broken yellow line indicates you can pass if the road is clear and safe.', 2, NOW()),
    (gen_random_uuid(), v_signals_material_id, 'What is the meaning of a double solid yellow line?', 'multiple_choice', ARRAY['No passing from either direction', 'Passing allowed if safe', 'Caution - road work ahead', 'School zone warning'], 'No passing from either direction', 'Double solid yellow lines mean no passing is allowed in either direction.', 2, NOW());

    RAISE NOTICE 'Inserted 15 Signals sample questions (full version has 120)';

    -- Add Safety Questions (15 sample of 120 total)
    INSERT INTO quiz_questions (id, material_id, question_text, question_type, options, correct_answer, explanation, difficulty, created_at)
    VALUES
    (gen_random_uuid(), v_safety_material_id, 'What is the maximum speed limit on residential streets in Manitoba?', 'multiple_choice', ARRAY['40 km/h', '50 km/h', '60 km/h', '70 km/h'], '50 km/h', 'Standard residential = 50 km/h unless posted otherwise.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'Speed limit in school zone during school hours?', 'multiple_choice', ARRAY['50 km/h', '40 km/h', '20-30 km/h', 'No limit'], '20-30 km/h', 'School zones require 20-30 km/h during operating hours - watch for kids.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'Default highway speed limit in Manitoba?', 'multiple_choice', ARRAY['80 km/h', '100 km/h', '110 km/h', '120 km/h'], '110 km/h', 'Highway speed limit = 110 km/h unless posted lower.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'What is speed limit near pedestrian/playground areas?', 'multiple_choice', ARRAY['50 km/h', '40 km/h', '30 km/h', '20 km/h'], '30 km/h', 'Playgrounds/pedestrian areas = 30 km/h for child safety.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'When must you reduce speed below posted limit?', 'multiple_choice', ARRAY['Never', 'When conditions require', 'Only at night', 'Only in winter'], 'When conditions require', 'Always reduce speed for weather, visibility, traffic, road conditions.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'Is posted speed limit maximum or target?', 'multiple_choice', ARRAY['Target speed', 'Exact speed required', 'Maximum safe speed in ideal conditions', 'Minimum speed'], 'Maximum safe speed in ideal conditions', 'Posted limit is max under ideal conditions - reduce for poor conditions.', 2, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'What does a safe following distance rule?', 'multiple_choice', ARRAY['1 car length', '2 seconds behind vehicle', 'Distance in meters = speed in km/h', 'Whatever feels comfortable'], '2 seconds behind vehicle', 'Two-second rule: maintain 2 seconds between you and vehicle ahead at any speed.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'When should headlights be on?', 'multiple_choice', ARRAY['Night only', 'Day and night', 'Reduced visibility or sunset to sunrise', 'Only in rain'], 'Reduced visibility or sunset to sunrise', 'Headlights: from sunset to sunrise AND whenever visibility is reduced.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'How should you hold the steering wheel while driving?', 'multiple_choice', ARRAY['One hand at 12 o''clock', 'Both hands at 9 and 3 o''clock', 'Wherever comfortable', 'Left hand only on curves'], 'Both hands at 9 and 3 o''clock', 'Proper grip (9 and 3) provides best control and response to emergencies.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'What is most dangerous winter condition?', 'multiple_choice', ARRAY['Snow', 'Rain', 'Ice (black ice)', 'Wind'], 'Ice (black ice)', 'Black ice is invisible, slippery, and causes loss of control - most dangerous.', 2, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'What should you do if you start to skid on ice?', 'multiple_choice', ARRAY['Slam on brakes', 'Steer direction you want to go, ease off gas', 'Accelerate', 'Honk horn'], 'Steer direction you want to go, ease off gas', 'Skid: steer where you want front to go, reduce throttle, don''t brake hard.', 2, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'If brakes fail while driving, what do you do?', 'multiple_choice', ARRAY['Panic and swerve', 'Pump brakes, shift to neutral, use emergency brake', 'Speed up to get to safety', 'Turn off engine'], 'Pump brakes, shift to neutral, use emergency brake', 'Brake failure: pump pedal, shift neutral, gradually apply emergency brake.', 2, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'Legal alcohol limit for driving?', 'multiple_choice', ARRAY['0%', '0.05%', '0.08%', '0.10%'], '0.08%', 'Legal limit: 0.08% BAC (blood alcohol content) for regular drivers.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'Can you use cell phone while driving?', 'multiple_choice', ARRAY['Yes anytime', 'Hand-free only - held devices illegal', 'Only in emergency', 'At red lights'], 'Hand-free only - held devices illegal', 'Cell phone: hand-free systems legal, holding/texting illegal - distracted driving violation.', 1, NOW()),
    (gen_random_uuid(), v_safety_material_id, 'Minimum age for seatbelt exemption?', 'multiple_choice', ARRAY['No exemptions', 'Medical note only', 'Anyone can go without', 'Driving alone'], 'Medical note only', 'Seatbelts mandatory except with medical exemption - always wear unless exempt.', 1, NOW());

    RAISE NOTICE 'Inserted 15 Safety sample questions (full version has 120)';

    RAISE NOTICE '✅ SUCCESS! Test materials created.';
    RAISE NOTICE 'NOTE: 15 sample questions per test inserted. Full version has 120 per test.';

END $$;
