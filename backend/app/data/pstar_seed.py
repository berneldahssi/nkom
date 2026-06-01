"""PSTAR question bank — Transport Canada TP 11919E (7th Edition, Dec 2022).

Structure per section: (section_number, title, difficulty, summary_md, questions)
Each question: (source_ref, question_text, [options], correct_index, hint)
"""

PSTAR_SECTIONS = [
    (1, "Collision Avoidance", "medium",
     """## Right-of-Way Order
- Aircraft in distress has right of way over all others
- Priority order (highest to lowest): balloon → glider → airship → power-driven aircraft
- Lower category always yields to higher category

## Converging & Head-On
- Converging at the same altitude: the aircraft that has the other on its right shall give way
- Head-on: both pilots alter heading to the right
- Overtaking: pass to the right; the overtaken aircraft has right of way

## Final Approach
- Aircraft on final approach has right of way over aircraft in flight or taxiing
- Lower aircraft on approach has right of way over higher aircraft
- Never cut off another aircraft established on final""",
     [
         ("1.01", "Which statement is true regarding aircraft converging at approximately the same altitude?",
          ["A jet airliner has the right of way over all other aircraft",
           "An aircraft towing objects has the right of way over all power-driven heavier-than-air aircraft",
           "An aeroplane has the right of way over all other aircraft converging from the left",
           "Aeroplanes towing gliders must give way to helicopters"],
          1, "Tow beats power — a towing aircraft always has priority over all power-driven aircraft"),
         ("1.02", "When two aircraft are converging at approximately the same altitude:",
          ["Both aircraft shall alter heading to the left",
           "The aircraft on the right shall avoid the other by descending",
           "The aircraft that has the other on its right shall give way",
           "The aircraft that has the other on its left shall give way"],
          2, "Keep the other aircraft on your LEFT — if it's on your right, you give way"),
         ("1.03", "When two aircraft are converging at approximately the same altitude, which statement applies?",
          ["Gliders shall give way to helicopters",
           "Aeroplanes shall give way to power-driven heavier-than-air aircraft",
           "Gliders shall give way to aeroplanes",
           "Power-driven heavier-than-air aircraft shall give way to gliders"],
          3, "Priority order (top to bottom): Balloons → Gliders → Airships → Power-driven aircraft"),
         ("1.04", "When two aircraft are converging at approximately the same altitude:",
          ["Gliders shall give way to helicopters",
           "Aeroplanes shall give way to helicopters",
           "Helicopters shall give way to aeroplanes",
           "Helicopters shall give way to gliders"],
          3, "Gliders are non-powered — both aeroplanes and helicopters yield to gliders"),
         ("1.05", "When two aircraft are converging at approximately the same altitude:",
          ["Helicopters shall give way to aeroplanes",
           "Aeroplanes shall give way to gliders",
           "Helicopters shall give way to aeroplanes",
           "Gliders shall give way to balloons"],
          1, "Balloons are hardest to manoeuvre — everything gives way to them except other balloons"),
         ("1.06", "When converging at approximately the same altitude:",
          ["Balloons shall give way to hang gliders",
           "Aeroplanes towing gliders shall give way to balloons",
           "Balloons shall give way to gliders",
           "Balloons shall give way to airships"],
          1, "Balloons have TOP priority — all power-driven aircraft (including towing aircraft) yield to balloons"),
         ("1.07", "When two power-driven heavier-than-air aircraft are converging:",
          ["The one on the left has the right of way",
           "Both shall alter heading to the left",
           "The one on the right has the right of way",
           "The one on the right shall give way by descending"],
          2, "Same as a road: the one on the right has priority"),
         ("1.08", "When two aircraft approach each other head-on and there is a risk of collision, each pilot shall:",
          ["Decrease airspeed", "Increase airspeed",
           "Alter heading to the right", "Alter heading to the left"],
          2, "Head-on: BOTH turn RIGHT — same rule as cars approaching on a road"),
         ("1.09", "When overtaking another aircraft at the same altitude, you shall:",
          ["Climb", "Descend", "Alter heading to the right", "Alter heading to the left"],
          2, "Overtaking: pass on the RIGHT — the aircraft ahead has right of way"),
         ("1.10", "Two aircraft are on approach to land at the same aerodrome. The aircraft at the higher altitude shall:",
          ["Have the right of way", "Overtake the lower aircraft on the left",
           "Give way", "Complete a 360° turn to the right"],
          2, "Higher approach = slower = give way. The lower aircraft is committed to landing"),
     ]),

    (2, "Visual Signals", "easy",
     """## Light Signals — Aircraft in Air
- Steady green: cleared to land
- Steady red: give way to other aircraft and continue circling
- Flashing green: return for landing (cleared to approach)
- Flashing red: aerodrome unsafe, do not land
- Flashing white: return to starting point on aerodrome
- Alternating red/green: exercise extreme caution

## Light Signals — Aircraft on Ground
- Steady green: cleared for takeoff
- Steady red: stop
- Flashing green: cleared to taxi
- Flashing red: taxi clear of landing area in use
- Flashing white: return to starting point
- Alternating red/green: exercise extreme caution

## Visual Ground Markers
- White or yellow X on runway/taxiway: closed, do not use
- Yellow and black stripes on pylons/roof: fur farm (animals startle easily)
- Blinking runway edge/centre lights: vacate runway immediately

## Wildlife Overflight
- Do not overfly reindeer or caribou herds below 2,000 ft AGL""",
     [
         ("2.01", "A series of green flashes directed at an aircraft in flight, and then at an aircraft on the ground, means respectively:",
          ["Cleared to land; cleared to taxi", "Return for landing; cleared for take-off",
           "Return for landing; cleared to taxi", "Cleared to land; cleared for take-off"],
          2, "Flashing green (air): RETURN for landing. Flashing green (ground): cleared to TAXI"),
         ("2.02", "A steady red light directed at an aircraft in flight, and then at an aircraft on the ground, means respectively:",
          ["Give way to other aircraft and continue circling; stop",
           "Give way to other aircraft and continue circling; taxi clear of landing area in use",
           "Airport unsafe, do not land; taxi clear of landing area in use",
           "Airport unsafe, do not land; stop"],
          0, "Steady red (air): GIVE WAY and circle. Steady red (ground): STOP"),
         ("2.03", "A series of red flashes directed at an aircraft in flight, and then at an aircraft on the ground, means respectively:",
          ["Airport unsafe, do not land; taxi clear of landing area in use",
           "Give way to other aircraft and continue circling; stop",
           "Do not land for the time being; return to starting point on the airport",
           "You are in a prohibited area, alter course; stop"],
          0, "Flashing red (air): UNSAFE, don't land. Flashing red (ground): taxi CLEAR of landing area"),
         ("2.04", "A steady green light directed at an aircraft in flight, and then at an aircraft on the ground, means respectively:",
          ["Cleared to land; cleared to taxi", "Return for landing; cleared to taxi",
           "Return for landing; cleared for take-off", "Cleared to land; cleared for take-off"],
          3, "Steady green = GO — cleared to land (air) and cleared for take-off (ground)"),
         ("2.05", "A flashing white light directed at an aircraft on the manoeuvring area of an airport means:",
          ["Stop", "Return to starting point on the airport",
           "Cleared to taxi", "Taxi clear of landing area in use"],
          1, "Flashing white on ground: RETURN to starting point (like a reset signal)"),
         ("2.06", "Blinking runway edge lights or runway centre lights advise vehicles and pedestrians to:",
          ["Return to the apron", "Vacate the runway immediately",
           "Be aware that an emergency is in progress; continue with caution",
           "Be aware that an emergency is in progress; hold your position"],
          1, "Blinking runway lights = DANGER — vacate the runway immediately"),
         ("2.07", "Chrome yellow and black strips painted on pylons or on the roof of a building identify:",
          ["An area where explosives are in use", "A fur farm",
           "An artillery range", "An open pit mine"],
          1, "Yellow+black stripes = fur farm warning. Animals can be startled by aircraft"),
         ("2.08", "Pilots should not overfly reindeer or caribou herds at an altitude of less than:",
          ["2,500 feet AGL", "2,000 feet AGL", "1,500 feet AGL", "1,000 feet AGL"],
          1, "2,000 ft for caribou — TWO thousand, because most of these animals have TWO antlers"),
     ]),

    (3, "Communications", "medium",
     """## Initial Radio Contact
- First call format: aircraft type + last 4 letters of registration in phonetics
- Example: C-GFLU = 'Cessna Golf Foxtrot Lima Uniform'
- After ATS initiates abbreviation: use only last 3 letters

## Key Frequencies
- 126.7 MHz: VFR en route monitoring frequency (uncontrolled airspace)
- 121.5 MHz: International emergency/distress frequency — monitor always
- 123.2 MHz: ATF (Aerodrome Traffic Frequency) for aerodromes without published freq
- ATIS: listen before calling ATC; report 'with information [letter]'

## Distress & Urgency
- MAYDAY (×3): immediate grave danger — distress signal
- PAN PAN (×3): urgent but not immediately dangerous — urgency signal
- Cancel distress: MAYDAY + ALL STATIONS ×3 + call sign + SILENCE FINISHED + OUT

## Transponder Codes
- 7700: Emergency | 7600: Radio failure | 7500: Hijacking | 1200: VFR default
- VFR above 12,500 ASL: squawk 1400
- IDENT only when instructed by ATC

## ATC Clearances & Taxi
- Taxi clearance crosses taxiways freely — crossing a RUNWAY requires explicit clearance
- Read back hold-short instructions verbatim
- 'Immediate takeoff': taxi and take off in one continuous movement
- Clock positions: 12 o'clock = ahead, 3 = 90° right, 2 = 60° right

## NOTAMs & FSS
- NOTAMs available at all Flight Service Stations
- Without APRX: expires at quoted time | With APRX: valid until cancelling NOTAM
- Call FSS as '[Station] Radio, this is...'
- Readability scale: 1=Unreadable, 3=Readable with difficulty, 5=Perfectly readable""",
     [
         ("3.01", "On initial radio contact, the registration C-GFLU should be transmitted as:",
          ["Lima – Uniform", "Foxtrot – Lima – Uniform",
           "Golf – Foxtrot – Lima – Uniform", "Charlie – Golf – Foxtrot – Lima – Uniform"],
          2, "Initial call = aircraft type + last 4 letters in phonetics: C-GFLU = Golf Foxtrot Lima Uniform"),
         ("3.02", "On initial radio contact, the registration C-FBSQ should be transmitted as:",
          ["FBSQ", "Fox, Baker, Sugar, Queen",
           "Foxtrot, Bravo, Sierra, Quebec", "Bravo, Sierra, Quebec"],
          2, "Always use NATO phonetic alphabet — Foxtrot, Bravo, Sierra, Quebec (no slang or abbreviations)"),
         ("3.03", "After initial ATS contact, which items may be omitted from subsequent transmissions?",
          ["Any registration letters omitted by ATS in the last communication",
           "The first two letters of the registration, if ATS initiated the abbreviated call sign",
           "The first three letters of the registration", "The phonetic equivalents"],
          1, "ATS must initiate abbreviation first — then you can use only the last 3 letters"),
         ("3.04", "On initial radio contact with an ATS unit, transmit:",
          ["Aircraft type and last four letters of registration in phonetics",
           "Last three letters of registration in phonetics",
           "Whole registration in phonetics",
           "Aircraft type and last three letters in phonetics"],
          0, "First call = TYPE + last 4 letters in phonetics (e.g., 'Cessna Golf Foxtrot Lima Uniform')"),
         ("3.05", "ATIS is normally provided:",
          ["To replace the FSS", "To relieve frequency congestion",
           "For rapid weather forecast updates", "Only when VFR conditions exist"],
          1, "ATIS = Automatic Terminal Information Service — pre-recorded to reduce radio traffic"),
         ("3.06", "Where ATIS is available, the information to include on first ATC contact is:",
          ["'with the numbers'", "'ATIS received'", "'with the information'",
           "The ATIS phonetic identifier (e.g., 'with information Bravo')"],
          3, "Say the ATIS letter code: 'with information Bravo' tells ATC exactly which broadcast you heard"),
         ("3.07", "VFR aircraft operating en route in uncontrolled airspace shall continuously monitor:",
          ["126.7 MHz", "123.2 MHz", "122.8 MHz", "122.2 MHz"],
          0, "126.7 MHz = the VFR en route 'highway' frequency — always monitor it cross-country"),
         ("3.08", "En route aircraft should maintain a listening watch for distress signals on:",
          ["The receiver mode of the ELT", "121.5 MHz on the aircraft receiver",
           "121.5 MHz during first 5 minutes of each hour only",
           "The voice frequency of the navigation aid in use"],
          1, "121.5 MHz = international emergency/distress frequency — monitor it always on your receiver"),
         ("3.09", "Mandatory Frequency (MF) procedure specifications are given in:",
          ["Canada Flight Supplement (CFS)", "Designated Airspace Handbook",
           "A.I.P. Canada", "Flight Training Manual"],
          0, "CFS = Canada Flight Supplement — your airport information bible, including MF frequencies"),
         ("3.10", "When broadcasting on a Mandatory Frequency (MF) with no ground station in operation, transmissions are directed to:",
          ["Aerodrome UNICOM", "Closest ATC unit",
           "Aerodrome traffic", "First aircraft heard on frequency"],
          2, "No ground station = talk to other TRAFFIC on the frequency directly"),
         ("3.11", "A VFR aircraft intending to land at an aerodrome without a published frequency should broadcast on:",
          ["121.5 MHz", "122.2 MHz", "123.2 MHz", "126.7 MHz"],
          2, "123.2 MHz = ATF (Aerodrome Traffic Frequency) for uncontrolled aerodromes without published freq"),
         ("3.12", "Pilots departing VFR shall monitor the Mandatory Frequency (MF) until:",
          ["Beyond the specified distance or altitude limit", "Established en route",
           "Established at cruise altitude", "Clear of the aerodrome circuit pattern"],
          0, "Stay on MF until you pass the specified distance/altitude in the CFS — usually 5 NM radius"),
         ("3.13", "Cleared to taxi to Runway 04 (without a hold-short instruction), crossing two taxiways and one other runway, the clearance authorizes the pilot to taxi to:",
          ["Runway 04, but must hold short before reaching it",
           "Runway 04, but further clearance required to cross each taxiway and runway",
           "Position on Runway 04 without further clearance",
           "Runway 04, but further clearance required to cross the other runway"],
          3, "Taxi clearance crosses taxiways freely — but crossing a RUNWAY always needs explicit clearance"),
         ("3.14", "Ground control instructs 'hold short of Runway 04.' The correct readback is:",
          ["'to Runway 04'", "'to Runway 29'",
           "'hold short of Runway 29'", "'hold short of Runway 04'"],
          3, "Always read back hold-short instructions verbatim — this is a safety-critical clearance"),
         ("3.15", "When accepting an 'immediate take-off' clearance, the pilot shall:",
          ["Back-track on the runway to use its full length",
           "Complete the full pre-take-off check before taxiing",
           "Taxi onto the runway and take off in one continuous movement",
           "Taxi to a full stop position on the runway"],
          2, "'Immediate' means NOW — taxi onto runway and take off without stopping"),
         ("3.16", "Flying heading 270°, ATC advises 'traffic 2 o'clock, 5 miles, eastbound.' Where is the traffic?",
          ["60° to the left, altitude unknown", "60° to the right, altitude unknown",
           "90° to the right, same altitude", "90° to the left, same altitude"],
          1, "2 o'clock = 60° right of your nose (12=straight ahead, 3=90° right). Altitude not stated = unknown"),
         ("3.17", "Cleared to land with instructions to 'turn right at the first intersection,' the pilot should:",
          ["Land and attempt the turn despite high speed",
           "Complete a touch-and-go if the turn is unsafe",
           "Land and turn at the nearest intersection where it can be done safely",
           "Land and execute a 180° turn to clear at the required intersection"],
          2, "Safety always overrides ATC instructions — use the nearest SAFE intersection to turn"),
         ("3.18", "The radiotelephone distress signal indicating grave and imminent danger is:",
          ["MAYDAY, MAYDAY, MAYDAY", "PAN PAN, PAN PAN, PAN PAN",
           "SECURITY, SECURITY, SECURITY", "EMERGENCY, EMERGENCY, EMERGENCY"],
          0, "MAYDAY = mortal danger (from French 'm'aidez' = help me). Said 3 times."),
         ("3.19", "The radiotelephone urgency signal used when the safety of the aircraft is uncertain but immediate assistance is not yet required is:",
          ["MAYDAY, MAYDAY, MAYDAY", "PAN PAN, PAN PAN, PAN PAN",
           "EMERGENCY, EMERGENCY, EMERGENCY", "URGENCY, URGENCY, URGENCY"],
          1, "PAN PAN = urgent but not life-threatening yet (from French 'panne' = breakdown)"),
         ("3.20", "Cancellation of a distress message should include:",
          ["MAYDAY, MAYDAY, MAYDAY with an appropriate format",
           "'MAYDAY, ALL STATIONS, ALL STATIONS, ALL STATIONS, [call sign], SILENCE FINISHED, OUT'",
           "MAYDAY CANCELLED repeated three times",
           "ALL STATIONS with EMERGENCY OVER"],
          1, "End distress with: MAYDAY + ALL STATIONS x3 + call sign + SILENCE FINISHED + OUT"),
         ("3.21", "A departing flight from a tower-controlled aerodrome normally remains on the tower frequency until:",
          ["2,000 feet AGL", "25 NM from the airport",
           "15 NM from the Control Zone", "Clear of the Control Zone"],
          3, "Stay on tower until clear of Control Zone — then switch to departure frequency or 126.7"),
         ("3.22", "After advising ATC of your downwind leg position, ATC will:",
          ["Inform you of your approach sequence number or give other instructions",
           "Inform you of runway, wind, and altimeter setting",
           "Advise you of all circuit traffic", "Clear you to land"],
          0, "Downwind position report triggers: sequence number (e.g., '#2 follow the Piper')"),
         ("3.23", "Cleared to land, you acknowledge by:",
          ["Replying 'Roger'", "Replying 'Wilco'",
           "Clicking the microphone button", "Transmitting your aircraft call sign"],
          3, "Clearances: acknowledge by reading back call sign (or key parts) — not just 'Roger'"),
         ("3.24", "Your initial call to Timmins Flight Service Station (FSS) should begin 'Timmins:'",
          ["Radio, this is...", "Flight Service Station, this is...",
           "UNICOM, this is...", "[station name only], this is..."],
          0, "Call FSS as 'Radio' — historical convention: 'Timmins Radio, this is Cessna Golf...'"),
         ("3.25", "A primary responsibility of a flight service specialist (FSS) is to:",
          ["Provide air traffic control services", "Provide flight planning services",
           "Provide ATS only in uncontrolled airspace", "Provide terminal radar services"],
          1, "FSS = Flight Service Station — provides weather, flight plans, NOTAMs. NOT ATC."),
         ("3.26", "NOTAMs are:",
          ["Available at all Flight Service Stations", "Mailed to all pilots",
           "Issued only for airport facility closures", "Valid for 24 hours only"],
          0, "NOTAMs are available at FSS, by phone, online (Nav Canada site) — FSS is always an option"),
         ("3.27", "A new or replacing NOTAM that does not include the letters 'APRX' is valid:",
          ["For 48 hours only", "For the day it was issued",
           "Until the quoted time", "Until a cancelling NOTAM is issued"],
          2, "No APRX = exact time — NOTAM expires precisely at the stated time (no ambiguity)"),
         ("3.28", "The letters 'APRX' in a NOTAM indicate it is valid:",
          ["Approximately 24 hours", "Approximately 48 hours",
           "Until the quoted approximate time", "Until a cancelling or replacing NOTAM is issued"],
          3, "APRX = approximate — NOTAM stays valid until officially cancelled, even past quoted time"),
         ("3.29", "A readability of THREE means transmissions are:",
          ["Readable now and then", "Readable with difficulty",
           "Readable", "Perfectly readable"],
          1, "Scale: 1=Unreadable, 2=Readable now&then, 3=Readable with difficulty, 4=Readable, 5=Perfect"),
     ]),

    (4, "Aerodromes", "easy",
     """## Aerodrome Definitions
- Airport = CERTIFIED aerodrome (inspected and approved by Transport Canada)
- Manoeuvring area = runways + taxiways (NOT apron/ramp)
- Wind sock fully horizontal = 15 KT or more wind

## Runway Markings & Numbering
- White or yellow X: closed runway or taxiway — do not use
- Runway numbered by magnetic heading ÷ 10 (e.g., Runway 09 = 090° heading)
- Taxiway holding position: stop on the SOLID line side unless ATC clears you

## Traffic Circuit
- Standard circuit is left-hand unless otherwise published
- Circuit altitude: 1,000 ft AGL for fixed-wing (check local procedures)
- Join at 45° to the downwind leg at circuit altitude
- Minimum overflight altitude above aerodrome: 2,000 ft AGL

## Holding Positions
- Without marked hold position: hold at least 200 ft from runway edge
- Aircraft must hold clear of runway unless cleared by ATC""",
     [
         ("4.01", "An airport is defined as:",
          ["An aerodrome with paved runways", "An aerodrome with a control tower",
           "A registered aerodrome", "A certified aerodrome"],
          3, "Airport = CERTIFIED aerodrome (inspected and approved by Transport Canada). Not just 'registered'."),
         ("4.02", "A Transport Canada standard wind direction indicator (windsock) in dry conditions, when fully horizontal, indicates a wind speed of at least:",
          ["25 KT", "15 KT", "10 KT", "6 KT"],
          1, "Fully extended windsock = 15 KT or more. Drooping = less than 3 KT."),
         ("4.03", "Permission to operate vehicles on the movement area of an uncontrolled airport must be obtained from:",
          ["The operator of the airport", "The airport security officer",
           "A federal peace officer", "A qualified flying instructor"],
          0, "Airport operator = the person responsible — check the 'OPR' section in the CFS"),
         ("4.04", "Closed runways and taxiways are marked by:",
          ["Red flags", "Horizontal red squares with yellow diagonals",
           "A white or yellow X", "White dumb-bells"],
          2, "X marks the closed spot — white or yellow X on runway/taxiway means DO NOT USE"),
         ("4.05", "The west end of an east-west runway is numbered:",
          ["09", "90", "27", "270"],
          0, "West end of E-W runway: aircraft landing at west end face EAST (090°) = Runway 09"),
         ("4.06", "Taxiway holding position markings indicate that aircraft shall stop:",
          ["On the solid line side at all times",
           "On the solid line side unless otherwise cleared by ATC",
           "Before crossing lines from either side at all times",
           "Before crossing lines unless cleared by ATC from either side"],
          1, "Solid line = stop side. Stop on the SOLID side unless ATC clears you across."),
         ("4.07", "An aircraft awaiting runway entry, without an established holding position, should hold at least:",
          ["Clear of the manoeuvring area", "50 feet from the runway edge",
           "150 feet from the runway edge", "200 feet from the runway edge"],
          3, "200 feet from runway edge without a marked hold position — stay well clear of the active runway"),
         ("4.08", "The manoeuvring area of an aerodrome is the area used for:",
          ["Normally the ramp or apron", "Taxiing, including the apron",
           "Taxiing to and from parking", "Taxiing, taking off, and landing"],
          3, "Manoeuvring area = runways + taxiways (NOT the apron/ramp). Used for all aircraft movement."),
         ("4.09", "Except when taking off or landing, the minimum height to fly over an aerodrome is:",
          ["2,000 feet AGL", "1,500 feet AGL", "1,000 feet AGL", "500 feet AGL"],
          0, "Overfly at 2,000 ft AGL — 500 ft above typical 1,500 ft circuit altitude keeps you clear of traffic"),
         ("4.10", "Hospital heliport and heliport markings are identified respectively by the letters:",
          ["D, C", "D, A", "B, C", "A, B"],
          3, "Hospital heliport = 'H' inside a red cross (marked A). Standard heliport = 'H' in white (marked B)."),
     ]),

    (5, "Equipment", "medium",
     """## Required Documents on Board (Radio-Equipped Aircraft)
- Crew Licences + Radiotelephone Operator's Certificate + Journey Log + Liability Insurance

## Required Flight Instruments — Day VFR
- Controlled airspace: airspeed indicator + sensitive altimeter + timepiece (+ magnetic compass)
- Uncontrolled: similar minimums per CARs

## Oxygen Requirements
- Above 13,000 ft ASL: oxygen required at all times
- 10,000–13,000 ft ASL: may operate without oxygen for maximum 30 minutes

## ELT (Emergency Locator Transmitter)
- Test only during first 5 minutes of any UTC hour, maximum 5 seconds
- Emergency: turn on immediately and leave on
- Accidental activation: report to nearest ATS unit

## Other Equipment Rules
- Landing light required when carrying passengers at night
- Life preserver per person for seaplane operations
- Infant (under 2 years): held in adult's arms with adult's seatbelt fastened
- Night aerodrome operations: aerodrome must be officially lit (CARs 301.01)
- 121.5 MHz: international VHF emergency frequency""",
     [
         ("5.01", "What documents must be carried on board a radio-equipped Canadian privately registered aircraft (excluding ultra-light aeroplanes and balloons)?",
          ["Certificate of Airworthiness; Certificate of Registration; Radiotelephone Operator's Certificate; Journey Log",
           "Certificate of Airworthiness; Certificate of Registration; Crew Licences; Radiotelephone Operator's Certificate",
           "Certificate of Registration; Crew Licences; Radiotelephone Operator's Certificate; Proof of Liability Insurance",
           "Crew Licences; Radiotelephone Operator's Restricted Certificate; Aircraft Journey Log Book; Proof of Liability Insurance"],
          3, "4 required on board: Crew Licence + Radiotelephone Cert + Journey Log + Liability Insurance"),
         ("5.02", "Private aeroplanes and helicopters flying VFR 25 NM or more from an aerodrome or operating base may require:",
          ["Specified emergency supplies be carried",
           "A functioning radio capable of two-way communication",
           "The aircraft be multi-engined when passengers are carried",
           "All of the above"],
          0, "25+ NM from an aerodrome: emergency survival equipment may be required (CARs 602.61)"),
         ("5.03", "When is a serviceable landing light required equipment?",
          ["Carrying passengers at night",
           "Carrying passengers at night, except in private aircraft under 5,700 kg",
           "When using an unlighted aerodrome", "Any time taking off or landing at night"],
          0, "Landing light required when carrying PASSENGERS at night — not required for solo night flight"),
         ("5.04", "Without readily available oxygen equipment, an unpressurized aircraft cannot be operated above:",
          ["9,500 feet ASL", "10,000 feet ASL", "12,500 feet ASL", "13,000 feet ASL"],
          3, "13,000 ft ASL = max without oxygen. Remember: unlucky 13 — above it, you need O2."),
         ("5.05", "Flight crew members may operate between 10,000 and 13,000 feet ASL without oxygen for a maximum of:",
          ["15 minutes", "30 minutes", "1 hour", "2 hours"],
          1, "10,000–13,000 ft: 30 minutes max without O2. Above 13,000 ft: O2 required at all times."),
         ("5.06", "The safety equipment required for a single-engine aircraft taking off from or landing on water is:",
          ["An approved life raft", "An approved life preserver for each person on board",
           "A signal flare", "A signal mirror"],
          1, "Seaplane or floatplane: approved life preserver per person — immediate donning availability required"),
         ("5.07", "The International VHF Emergency Frequency is:",
          ["121.5 MHz", "121.9 MHz", "122.2 MHz", "126.7 MHz"],
          0, "121.5 MHz = 'one-two-one-decimal-five for life' — universal emergency frequency worldwide"),
         ("5.08", "Night takeoffs and landings at an aerodrome require:",
          ["Aircraft equipped with a functioning two-way radio",
           "Aircraft equipped with functioning landing light(s)",
           "The aerodrome to be lighted as prescribed by the Minister",
           "Pilot must have completed 3 night landings in the previous 90 days"],
          2, "Night ops at aerodrome: the AERODROME must be officially lit — not just the aircraft"),
         ("5.09", "CARs define an infant passenger as:",
          ["A child weighing less than 30 LB", "A child under 3 years of age",
           "A child weighing less than 50 LB and under 5 years of age", "A child under 2 years of age"],
          3, "CARs infant = under 2 years old (not weight-based like car seats)"),
         ("5.10", "When directed to fasten safety belts, an infant for whom no child restraint system is available shall be:",
          ["Fastened securely in a seat by the safety belt",
           "Held securely in an adult's arms with the adult's safety belt fastened",
           "Held in an adult's arms with the safety belt fastened about both",
           "Secured by any one of the above methods"],
          1, "Infant with no restraint: held in adult's arms, with the ADULT'S seatbelt fastened"),
         ("5.11", "The flight instruments required for day VFR flight within controlled airspace (in addition to the magnetic compass) are:",
          ["Airspeed indicator, sensitive altimeter, timepiece",
           "Airspeed indicator, attitude indicator, sensitive altimeter, timepiece",
           "Airspeed indicator, sensitive altimeter, turn and bank indicator, timepiece",
           "Airspeed indicator, sensitive altimeter, heading indicator, timepiece"],
          0, "Day VFR controlled airspace: ASI + altimeter + clock (plus compass = 4 total)"),
     ]),

    (6, "Pilot Responsibilities", "hard",
     """## Wake Turbulence & ATC Clearances
- Wake turbulence avoidance after heavy aircraft: pilot's call — may decline clearance
- Intersection takeoff: pilot is solely responsible for verifying sufficient runway length
- 'Cleared to the circuit': join on the downwind leg at circuit height
- NORDO circuit: fly 500 ft ABOVE standard circuit height

## Circuit Procedures
- Right turns in left-hand circuit: only to join crosswind or downwind
- Without landing clearance: request it even if runway appears clear
- High crosswind: go around and request different runway
- Minimum circuit height always 500 ft below cloud base (VFR cloud clearance)

## VFR Responsibilities
- VFR pilots always responsible for maintaining VFR — ATC vectors do not transfer responsibility
- See-and-avoid: if you see a conflict, act on it and advise ATC
- Terrain/obstacle avoidance: ALWAYS the pilot's responsibility

## Transponder
- 1200: VFR below 12,500 ASL | 1400: VFR above 12,500 ASL
- IDENT: only when instructed by ATC
- Student PIC: day only, no passengers

## Regulations
- CARs 602.71: be familiar with ALL available appropriate information before flight
- VTA chart + CFS: terminal airspace info for busy airports
- Pilot must comply with light signals and ground markings at all times (unless safety overrides)""",
     [
         ("6.01", "If cleared for take-off immediately following a large aircraft's low approach and overshoot, the pilot should:",
          ["Take off immediately to avoid the trailing vortices",
           "Taxi to position and wait for it to be safe",
           "Decline the clearance and inform ATC of the reason",
           "Wait 2 minutes then take off"],
          2, "Wake turbulence after a large aircraft = pilot's call. Decline clearance if unsafe — ATC understands."),
         ("6.02", "When a controller suggests a takeoff from a runway intersection, the pilot must know:",
          ["The remaining runway length will not be stated by ATC",
           "It is the pilot's responsibility to verify there is sufficient runway length",
           "The controller will ensure sufficient runway length is available",
           "Noise abatement procedures are automatically cancelled"],
          1, "Intersection takeoff = PILOT calculates remaining runway. ATC won't confirm it's enough."),
         ("6.03", "If a pilot requests an intersection takeoff and is authorized, responsibility for ensuring sufficient runway length rests with:",
          ["ATC, who will always provide the remaining runway length",
           "ATC, who will ensure sufficient runway length is available",
           "The pilot", "Both pilot and ATC equally"],
          2, "You requested it — you own it. Intersection takeoff responsibility = pilot's entirely."),
         ("6.04", "When cleared 'to the circuit,' the pilot should interpret this as joining:",
          ["On the downwind leg", "From the upwind side in all cases",
           "On the base leg if convenient", "On final for a straight-in approach"],
          0, "Cleared 'to the circuit' = join on the DOWNWIND leg at circuit height"),
         ("6.05", "A NORDO aircraft attempting to obtain landing information should maintain:",
          ["Circuit height", "1,000 feet above circuit height",
           "At least 2,000 feet AGL", "At least 500 feet above circuit height"],
          3, "NORDO (no radio) circuit: fly 500 ft ABOVE circuit height to be visible and give way"),
         ("6.06", "With a left-hand circuit in effect, a right turn without ATC approval is permitted only to:",
          ["Join the final leg", "Join the base leg",
           "Join the crosswind leg or make a partial right turn to join the downwind",
           "Descend on the downwind leg"],
          2, "Right turns permitted only to join crosswind or downwind — never base or final without clearance"),
         ("6.07", "When instructed to continue an approach to a runway that appears clear, without having received a landing clearance, the pilot should:",
          ["Circle 360° to the left", "Circle 360° in the circuit direction",
           "Complete the landing", "Request a landing clearance"],
          3, "No landing clearance = no landing. Ask for it explicitly even if runway looks clear."),
         ("6.08", "Airport elevation 400 ft ASL, circuit height 1,500 ft ASL, ceiling 1,000 ft overcast, visibility 3 miles. The circuit height should be:",
          ["500 feet below the cloud base", "1,500 feet ASL",
           "1,100 feet above airport elevation", "1,000 feet above airport elevation"],
          0, "VFR requires 500 ft below cloud — if ceiling limits your circuit height, fly 500 ft below cloud"),
         ("6.09", "With a ceiling of 1,000 feet overcast and 3-mile visibility, an aircraft cleared to the circuit must join:",
          ["As high as possible without entering cloud", "At 500 feet below the cloud base",
           "At 700 feet AGL", "In accordance with Special VFR"],
          1, "VFR cloud clearance: 500 ft below cloud base required. No exceptions in controlled airspace."),
         ("6.10", "Normal VFR circuit entry at 1,000 feet AGL may not be possible due to:",
          ["A possible straight-in clearance requiring a lower final approach",
           "A special procedures NOTAM that prescribes a different altitude",
           "Weather conditions that require a lower circuit height",
           "Any of the above circumstances"],
          3, "Circuit altitude can be changed by weather, NOTAMs, or ATC straight-in approach"),
         ("6.11", "A pilot on final approach is requested by ATC to reduce airspeed. The pilot should:",
          ["Comply while considering the safe minimum manoeuvring speed",
           "Acknowledge and execute a 360° turn",
           "Execute an overshoot and rejoin the circuit",
           "Reduce speed well below the normal approach range"],
          0, "Follow ATC speed reduction BUT never below safe minimum — safety overrides compliance"),
         ("6.12", "A pilot cleared to land is concerned the crosswind component is excessive. The pilot should:",
          ["Use full flaps and reduced speed to compensate",
           "Alter heading and attempt to land on a different runway",
           "Execute an overshoot and request the into-wind runway",
           "Continue the approach as the clearance must be obeyed"],
          2, "High crosswind = go around and request a different runway. Safety first, clearance second."),
         ("6.13", "A VFR pilot being radar-vectored toward extensive unbroken cloud: the responsibility to remain VFR rests with:",
          ["The radar operator", "ATC (since the flight is VFR)",
           "ATC (since cloud is visible on radar)", "The pilot"],
          3, "VFR = pilot's responsibility ALWAYS. ATC vectors do NOT transfer responsibility for VFR separation."),
         ("6.14", "A student pilot on VFR, given a radar vector toward a solid overcast at a lower altitude, should:",
          ["Climb above cloud for 'VFR over top'",
           "Alter heading to remain VFR and advise ATC immediately",
           "Maintain heading/altitude as it is an ATC clearance",
           "Maintain heading/altitude since ATC has cloud visible on radar"],
          1, "Pilot owns VFR — alter heading to stay clear of cloud and TELL ATC what you're doing"),
         ("6.15", "A Special VFR 'straight-in' approach with low ceiling and visibility: responsibility to avoid a radio mast on approach rests with:",
          ["The pilot", "The tower controller", "ATC", "Both pilot and controller equally"],
          0, "Terrain/obstacle avoidance is ALWAYS the pilot's responsibility, even under SVFR"),
         ("6.16", "A Special VFR pilot cleared to the circuit with solid stratus below circuit height: responsibility for remaining clear of cloud rests with:",
          ["The tower controller (within a Control Zone)",
           "ATC (weather is below VFR minimums)",
           "Both pilot and ATC", "The pilot"],
          3, "SVFR: ATC grants clearance, but cloud avoidance = pilot's job. Always."),
         ("6.17", "A VFR pilot in Class C airspace is given a specific heading by ATC that appears to conflict with another aircraft. The pilot should:",
          ["Always change altitude to resolve the conflict",
           "Maintain heading to comply with regulations",
           "Alter heading to avoid the conflict and advise ATC",
           "Maintain heading as the controller provides separation"],
          2, "VFR see-and-avoid: if you see a conflict, act on it and tell ATC — don't wait for clearance"),
         ("6.18", "VFR pilots shall select transponder code 1200 at or below ___ feet ASL and code ___ above that altitude:",
          ["12,500 / 1400", "12,500 / 1300", "10,000 / 1400", "10,000 / 1300"],
          0, "Below 12,500 ASL = squawk 1200. Above 12,500 ASL = squawk 1400 (VFR high level)"),
         ("6.19", "Pilots shall activate the transponder IDENT feature:",
          ["Before entering control zones", "Only when instructed by ATC",
           "Before every altitude change", "After every code assignment"],
          1, "IDENT only when ATC asks for it — unsolicited IDENTs confuse controllers"),
         ("6.20", "A student pilot permit holder may act as pilot-in-command for their own flight training:",
          ["Only when accompanied by a flight instructor",
           "By day and by night", "By day only",
           "While carrying passengers for training purposes"],
          2, "Student PIC = day only. No night solo, no passengers (except instructor during dual)"),
         ("6.21", "The pilot-in-command shall comply with light signals and ground markings prescribed in CARs:",
          ["Only in Class C airspace if they are part of a clearance",
           "Only in a Control Zone if they are part of an instruction",
           "At all times",
           "At all times provided the safety of the aircraft is not jeopardized"],
          3, "Follow signals always — UNLESS safety requires otherwise. Safety > compliance."),
         ("6.22", "Before a VFR flight, the pilot is required to:",
          ["Read all weather reports within 100 miles of the destination",
           "File a flight itinerary",
           "Become familiar with all available appropriate information",
           "Obtain an ATC clearance"],
          2, "CARs 602.71: be familiar with ALL available APPROPRIATE information — weather, NOTAMs, fuel, etc."),
         ("6.23", "Terminal airspace dimensions and VHF sector frequencies for high-density Canadian airports are shown on:",
          ["The Designated Airspace Handbook and A.I.P. Canada",
           "The VTA chart and the Canada Flight Supplement (CFS)",
           "VTA and VNC charts", "The CFS and VNC chart"],
          1, "VTA (Visual Terminal Area) chart + CFS = terminal airspace info for busy airports"),
     ]),

    (7, "Wake Turbulence", "medium",
     """## What Are Wake Vortices?
- Rotating cylinders of air created at each wingtip as lift is generated
- Begin EXACTLY at rotation (not at full power, not at liftoff)
- Heaviest + cleanest (flaps up) + slowest = strongest vortices
- Vortices sink at 400–500 ft/min and spread outward from aircraft track
- Persist 2+ minutes in still air
- All aircraft (fixed and rotary wing) produce wake turbulence

## Avoidance on Takeoff
- Rotate before the preceding heavy aircraft's rotation point
- Climb above and upwind of the preceding aircraft's flight path
- Takeoff responsibility: sole responsibility of the pilot (not ATC)

## Avoidance on Landing
- Land beyond the touchdown point of the preceding heavy aircraft
- Fly approach above and upwind of the preceding aircraft's approach path
- Light crosswind: can keep one vortex stationary over the runway — use upwind side

## Key Facts
- Worst vortex: heavy + clean (flaps up) + slow
- Helicopter vortices in forward flight: same behaviour as fixed-wing wingtips
- Helicopter vortex intensity: proportional to size and weight
- 'Jet wash' is exhaust — NOT the same as wake vortices (caused by lift generation)""",
     [
         ("7.01", "Avoiding wake turbulence is:",
          ["The sole responsibility of ATC",
           "The responsibility of the pilot only when advised by ATC of the possibility of wake turbulence",
           "A responsibility shared by both the pilot and ATC",
           "The sole responsibility of the pilot"],
          3, "Wake turbulence = PILOT'S responsibility, period. ATC may warn, but avoidance is yours."),
         ("7.02", "Hazardous wake turbulence caused by aircraft in still air:",
          ["Dissipates immediately", "Dissipates rapidly",
           "May persist for two minutes or more", "Persists indefinitely"],
          2, "Wake turbulence: 2+ minutes in still air. Wait 2 minutes after a heavy passes."),
         ("7.03", "Which response is most correct with respect to wake turbulence?",
          ["Wing tip vortices are carried by the ambient wind",
           "Wing tip vortices have a circular and downward motion",
           "Wake turbulence exists behind all aeroplanes and helicopters in flight",
           "All three statements are correct"],
          3, "All three are true: vortices drift with wind, spin downward, and are made by ALL aircraft"),
         ("7.04", "The wing tip vortices generated by a heavy aeroplane can cause a lighter aircraft encountering them to:",
          ["Go out of control", "Continue descending even with maximum power applied",
           "Sustain structural damage", "Experience any of the above situations"],
          3, "Wake turbulence is deadly — any of: loss of control, uncontrolled descent, structural damage"),
         ("7.05", "During the two minutes after the passage of a heavy aeroplane in cruising flight, hazardous wing tip vortices will:",
          ["Dissipate completely", "Dissipate rapidly",
           "Dissipate very slowly", "Remain at cruising altitude"],
          2, "2 minutes = still dangerous, but dissipating slowly and sinking below the flight path"),
         ("7.06", "The pilot of a light aircraft on final approach close behind a heavier aircraft should plan the approach to land:",
          ["Beyond the touchdown point of the heavier aircraft",
           "Prior to the touchdown point of the heavier aircraft",
           "At the touchdown point of the heavier aircraft",
           "To the right or left of the heavier aircraft's touchdown point"],
          0, "Land BEYOND the heavy's touchdown — their vortices start at touchdown and sink behind"),
         ("7.07", "To avoid wake turbulence when taking off behind a large aircraft, the pilot should:",
          ["Remain in ground effect until past the rotation point of the large aircraft",
           "Become airborne in the calm airspace between the vortices",
           "Taxi until past the rotation point, then take off and remain below the climb path",
           "Become airborne before the rotation point of the large aircraft and stay above its departure path, or request a turn"],
          3, "Take off BEFORE the heavy's rotation point and STAY ABOVE its departure path"),
         ("7.08", "Wake turbulence is produced by:",
          ["Heavy aeroplanes only, regardless of speed",
           "Turbo-jet powered aircraft only",
           "Fast-moving aeroplanes only, regardless of weight",
           "All fixed and rotary wing aircraft"],
          3, "ALL aircraft produce wake turbulence — from a Cessna 152 to a Boeing 747"),
         ("7.09", "Wake turbulence caused by a departing large aeroplane begins:",
          ["Before rotation", "With rotation",
           "After becoming airborne", "With full power application"],
          1, "Vortices start EXACTLY at rotation (nose lifts) — not at full power, not at liftoff"),
         ("7.10", "Wake turbulence caused by a departing aeroplane is most severe immediately:",
          ["Before rotation", "Following take-off (just after rotation)",
           "Above its flight path", "Following full power application"],
          1, "Worst turbulence: just after takeoff at low speed, heavy weight, clean configuration"),
         ("7.11", "Which statement concerning wing tip vortices is FALSE?",
          ["Vortices normally settle below and behind the aircraft",
           "With a light crosswind, one vortex can remain stationary over the ground",
           "In a no-wind condition, lateral movement may place a vortex over a parallel runway",
           "Vortices are caused directly by jet wash"],
          3, "'Jet wash' is exhaust. Vortices are caused by LIFT generation (wing tip pressure difference)."),
         ("7.12", "Wake turbulence will be greatest when generated by an aeroplane that is:",
          ["Heavy, landing configuration, slow speed",
           "Heavy, clean configuration, slow speed",
           "Light, clean configuration, high speed",
           "Heavy, take-off configuration, slow speed"],
          1, "Maximum vortex = HEAVY + CLEAN (no flaps = more lift from wingtips) + SLOW = maximum lift per unit span"),
         ("7.13", "A helicopter in forward flight produces hazardous vortices:",
          ["Which rise above the helicopter", "Similar to wing tip vortices",
           "Which remain at the same level as the helicopter", "Ahead of the helicopter"],
          1, "Helicopter vortices in forward flight = same behaviour as fixed-wing wingtip vortices"),
         ("7.14", "Which statement concerning vortices caused by helicopters is correct?",
          ["Helicopter vortices are generally weak and dissipate rapidly",
           "The size and weight of the helicopter has a direct influence on the intensity of the vortices",
           "Helicopter vortices are less intense than vortices from an aeroplane of the same weight",
           "Wind does not influence the movement of vortices from a hovering helicopter"],
          1, "Bigger and heavier helicopter = more intense rotor wash. Same physics as fixed-wing."),
         ("7.15", "What effect would a light crosswind have on the wing tip vortices generated by a large aeroplane that had just taken off?",
          ["Could cause one vortex to remain over the runway for some time",
           "Would rapidly dissipate the strength of both vortices",
           "Would rapidly clear the runway of all vortices",
           "Would not affect the lateral movement of the vortices"],
          0, "Light crosswind: pushes one vortex ONTO runway — the upwind vortex stays put and lingers"),
     ]),

    (8, "Aeromedical", "easy",
     """## Hypoxia
- Oxygen deficiency affecting brain function
- Symptoms: euphoria, impaired judgment, cyanosis (blue lips), unconsciousness
- Insidious onset — pilot may not notice incapacitation
- Treatment: supplemental oxygen or immediate descent

## Hyperventilation
- Breathing too fast expels too much CO₂
- Symptoms: tingling fingers, dizziness, muscle cramps, fainting
- Treatment: slow breathing below 12 breaths/minute; breathe into paper bag

## Ear Pressure & SCUBA
- Most likely damage: during DESCENT (increasing pressure closes Eustachian tubes)
- Equalize with: swallowing, yawning, or Valsalva manoeuvre
- SCUBA with decompression stops: wait 24 hours before flying above 8,000 ft

## Time Limits Before Flying
- Blood donation: 48 hours
- General anaesthetic: return only with doctor's clearance (no fixed time)
- Local anaesthetic (dental): 24 hours
- Alcohol: 12 hours (CARs) + BAC must be below 0.04%

## Medical Certificates
- Private pilot under 40 years: 60-month (5-year) medical
- Private pilot 40 years and over: 24-month (2-year) medical
- Know medical: no flying if aware of disability making you unable to meet requirements

## Other Hazards
- Fatigue: slows reactions, causes errors
- Alcohol at altitude: hypoxia tolerance deteriorates with altitude
- Safest drug rule: no medication without Aviation Medical Examiner approval""",
     [
         ("8.01", "A flight crew member who is aware of a physical disability that makes them unable to meet the medical requirements of their licence should:",
          ["Advise the Minister (Transport Canada) of the disability",
           "Not commence flight as a flight crew member",
           "Forward their licence to the Regional Aviation Medical Officer",
           "Fly only when a backup crew member is available"],
          1, "Immediate action: DO NOT FLY. Also notify Transport Canada. Both required by CARs 403.03."),
         ("8.02", "The recommended treatment for hyperventilation below 8,000 feet is:",
          ["Increase breathing depth",
           "Hold breath and perform the Valsalva manoeuvre",
           "Slow breathing to below 12 times per minute",
           "Increase oxygen flow rates"],
          2, "Hyperventilation = too much CO2 expelled. Fix: SLOW your breathing rate consciously."),
         ("8.03", "Eardrum damage in flight is most likely to occur:",
          ["During climb", "During descent",
           "When using supplementary oxygen", "After SCUBA diving"],
          1, "Descent: increasing air pressure closes Eustachian tubes — can't equalize = eardrum damage"),
         ("8.04", "Clearing the ears on a rapid descent is most effectively assisted by:",
          ["Swallowing", "Opening the mouth or yawning",
           "The Valsalva manoeuvre", "All of the above"],
          3, "All three work — swallow, yawn, or Valsalva (pinch nose + blow gently). Try all if needed."),
         ("8.05", "Flight crew members who require decompression stops during SCUBA diving should not fly for at least:",
          ["4 hours", "8 hours", "12 hours", "24 hours"],
          3, "SCUBA with decompression stops: 24 hours before flying above 8,000 ft. 12 hours if no stops."),
         ("8.06", "Which statement is correct regarding fatigue per A.I.P. Canada?",
          ["Financial and family problems do not influence fatigue tolerance",
           "Fatigue slows reaction time and causes errors",
           "A fatigued person recuperates faster at altitude",
           "A fatigued person needs food immediately before and during flight"],
          1, "Fatigue = slower reactions + more errors. It's cumulative and worsens with altitude."),
         ("8.07", "A pilot who donates blood should not act as a flight crew member for at least:",
          ["12 hours", "24 hours", "36 hours", "48 hours"],
          3, "Blood donation: 48 hours before flying. Blood volume and O2 carrying capacity are reduced."),
         ("8.08", "After receiving a general anaesthetic, a pilot should not act as a flight crew member:",
          ["During the next 12 hours", "During the next 36 hours",
           "During the next 48 hours", "Unless their doctor advises it is safe to do so"],
          3, "General anaesthetic: return to flying only with DOCTOR'S clearance — no fixed time rule"),
         ("8.09", "After a local anaesthetic for extensive dental work, a pilot should not act as a flight crew member for at least:",
          ["12 hours", "24 hours", "36 hours", "48 hours"],
          1, "Dental local anaesthetic: 24 hours wait. Residual drug effects + potential pain = risk"),
         ("8.10", "The effect of alcohol on a pilot's tolerance to hypoxia as altitude increases:",
          ["Deteriorates with an increase in altitude",
           "Improves with an increase in altitude",
           "Is unaffected by altitude change",
           "Remains constant to 6,000 feet"],
          0, "Alcohol + altitude = double hit on brain. Hypoxia tolerance gets worse as altitude increases."),
         ("8.11", "The safest rule regarding over-the-counter medications and flying is:",
          ["Read manufacturer warnings carefully before flying",
           "Take no medication unless specifically approved by an Aviation Medical Examiner",
           "Allow 12 hours between taking medication and flying",
           "Allow 8 hours between taking medication and flying"],
          1, "Safest rule: NO medication without Aviation Medical Examiner (CAME) approval. Period."),
         ("8.12", "A private pilot medical certificate for a pilot 40 years of age or older is valid for:",
          ["12 months", "24 months", "36 months", "48 months"],
          1, "Private pilot 40+: 24-month medical (2 years). Under 40: 60 months (5 years)."),
         ("8.13", "A private pilot medical certificate for a pilot under 40 years of age is valid for:",
          ["72 months", "60 months", "48 months", "24 months"],
          1, "Private pilot under 40: 60-month medical (5 years). 40 and over: 24 months."),
     ]),

    (9, "Flight Plans and Flight Itineraries", "medium",
     """## Fuel Requirements (CARs 602.88)
- Aeroplane day VFR: destination + 30 min reserve at normal cruise
- Helicopter day VFR: destination + 20 min reserve at normal cruise

## Filing Requirements
- Flight plan OR itinerary required for flights 25 NM or more from point of origin
- Arrival report: within 60 minutes of filed ETA (call an ATS unit)
- Deviation from flight plan: notify ATC as soon as possible
- 'Responsible person' for itinerary: someone who agreed to report you OVERDUE

## Intermediate Stops
- Total elapsed time = all flight legs + all stopover durations
- Intermediate stop shown in Route column: e.g., 'CYOW 0030 CYQB'

## Flight Itinerary
- Contact responsible person ASAP after landing, maximum 24 hours after ETA
- If no SAR initiation time specified and no contact: report as soon as practicable, max 24 hrs after last reported ETA""",
     [
         ("9.01", "The amount of fuel and oil carried on board any helicopter at the commencement of a day VFR flight must be sufficient to fly to the destination aerodrome, and thereafter for:",
          ["45 minutes at normal cruising speed", "45 minutes, then to a specified alternate",
           "20 minutes at normal cruising speed", "20 minutes, then to a specified alternate"],
          2, "Helicopter day VFR: 20 minutes reserve fuel. Aeroplane day VFR: 30 minutes reserve."),
         ("9.02", "The amount of fuel carried on board any propeller-driven aeroplane at the commencement of a day VFR flight must be sufficient to fly to the destination aerodrome, and then fly for:",
          ["45 minutes at normal cruising speed", "30 minutes at normal cruising speed",
           "45 minutes, then to a specified alternate", "30 minutes, then to a specified alternate"],
          1, "Aeroplane day VFR: 30 minutes reserve fuel after reaching destination (CARs 602.88)"),
         ("9.03", "If a flight plan is not filed, a flight itinerary must be filed:",
          ["For flights proceeding 25 NM or more from the point of origin",
           "Only for flights in sparsely settled areas",
           "For flights destined to land at aerodromes other than the point of origin",
           "For all flights"],
          0, "25 NM from origin: file a flight plan OR flight itinerary. Under 25 NM: neither required."),
         ("9.04", "After landing from a VFR flight for which a flight plan was filed, the pilot shall report arrival to the appropriate ATS unit within:",
          ["15 minutes", "30 minutes", "45 minutes", "60 minutes"],
          3, "Flight plan arrival report: within 60 minutes of your filed ETA. SAR initiated if overdue."),
         ("9.05", "When there is a deviation from a VFR flight plan, ATC shall be notified:",
          ["As soon as possible", "Within 10 minutes",
           "Within 30 minutes", "Within 60 minutes after landing"],
          0, "Deviation from flight plan: notify ATC AS SOON AS POSSIBLE — SAR depends on accurate info"),
         ("9.06", "Where no search and rescue initiation time is specified in a flight itinerary, the pilot shall report to the responsible person:",
          ["Within one hour after landing",
           "Within one hour after the expiration of the estimated duration",
           "Within 24 hours after the expiration of the estimated duration",
           "As soon as practicable after landing, but no later than 24 hours after the last reported ETA"],
          3, "Flight itinerary: contact your responsible person ASAP after landing, max 24 hours after ETA"),
         ("9.07", "With regard to a flight itinerary, the 'responsible person' means someone who:",
          ["Has agreed to report the aircraft overdue", "Is 18 years of age or over",
           "Holds an aeronautical licence", "Has agreed to report the arrival of the aircraft"],
          0, "Responsible person for itinerary: agreed to report you OVERDUE to SAR (not just to report arrival)"),
         ("9.08", "Where a VFR flight plan has been filed, an arrival report must be made by the pilot:",
          ["By advising an ATS unit",
           "At each intermediate stop, then reopened on take-off",
           "By parking the aircraft in close proximity to the tower",
           "Except at airports served by a control tower"],
          0, "Close your flight plan by calling an ATS unit — don't assume tower does it automatically"),
         ("9.09", "A to B: 1 hour 15 minutes; stopover at B: 30 minutes; B to C: 1 hour 20 minutes. Total elapsed time for the flight plan is:",
          ["3 hours 50 minutes", "3 hours 20 minutes", "3 hours 05 minutes", "2 hours 35 minutes"],
          2, "1h15 + 30min + 1h20 = 3h05. Include ALL legs AND all stopovers in elapsed time."),
         ("9.10", "When filing a VFR flight plan with an intermediate stop, the total elapsed time to be entered is the total:",
          ["Elapsed time for all legs including the duration of the intermediate stop",
           "Elapsed time for all legs, plus the intermediate stop, plus 45 minutes",
           "Flight time for all legs only (no stopovers)",
           "Elapsed time to the first landing only"],
          0, "Total elapsed time = ALL flight legs + ALL stopover times combined. No extras."),
         ("9.11", "How is an intermediate stop indicated on the VFR flight plan form?",
          ["Including its duration in the 'Elapsed Time' box",
           "The same as any VFR flight plan if the stop is under 30 minutes",
           "By repeating the name of the intermediate stop and its duration in the 'Route' column",
           "By writing 'Intermediate Stop' in the 'Other Information' column"],
          2, "Intermediate stop in Route column: e.g., 'CYOW 0030 CYQB' = Ottawa, 30 min stop, Quebec"),
     ]),

    (10, "Clearances and Instructions", "medium",
     """## ATC Instructions vs Clearances
- Instruction: comply immediately on receipt (unless it jeopardizes safety)
- Clearance: binding only when ACCEPTED by the pilot — you can decline before accepting

## When You Can't Comply
- Partially accepted clearance: do what you can AND advise ATC as soon as possible
- If safety requires immediate action first: act, then advise ATC
- Unacceptable clearance: REFUSE it and tell ATC your intentions
- NEVER deviate silently — always communicate with ATC

## Traffic Responsibility
- ATC clearance is based on KNOWN traffic only
- VFR see-and-avoid duty remains with the pilot AT ALL TIMES
- An ATC clearance does NOT relieve the pilot of traffic avoidance responsibility""",
     [
         ("10.01", "An ATC instruction:",
          ["Must be complied with when received, provided the safety of the aircraft is not jeopardized",
           "Must be read back in full and confirmed before becoming effective",
           "Is advice from ATC and does not require acknowledgement by the pilot",
           "Is the same as an ATC clearance"],
          0, "ATC instruction = comply on receipt (unless it jeopardizes safety). Unlike a clearance, no acceptance needed."),
         ("10.02", "An ATC clearance:",
          ["Is the same as an ATC instruction", "Is advice from ATC and does not require acceptance",
           "Requires compliance when accepted by the PIC",
           "Must be complied with when received by the PIC"],
          2, "Clearance = binding when ACCEPTED. You can decline before accepting. Instruction = immediately binding."),
         ("10.03", "A pilot who has accepted a clearance and then finds it cannot be fully complied with should:",
          ["Disregard the clearance", "Comply with only the parts that are suitable",
           "Comply as best as possible without saying anything to ATC",
           "Comply as best as possible and advise ATC as soon as possible"],
          3, "Can't comply with clearance? Do what you can AND tell ATC immediately — don't just deviate silently"),
         ("10.04", "After accepting a clearance and finding it cannot be complied with, a pilot should:",
          ["Take any required immediate action and advise ATC as soon as possible",
           "Comply as best as possible without notifying ATC",
           "Disregard the clearance entirely", "Comply with only the suitable parts"],
          0, "Act first if safety requires it, then talk to ATC immediately — never silently deviate"),
         ("10.05", "An ATC clearance or instruction is predicated on known traffic only. Therefore, when a pilot is proceeding in accordance with a clearance or instruction:",
          ["ATC is relieved of the responsibility for traffic separation",
           "The responsibility for traffic separation is divided between ATC and the pilot",
           "The pilot is not relieved of the responsibility for traffic avoidance",
           "The pilot is relieved of the responsibility for traffic avoidance"],
          2, "Clearance ≠ traffic protection. VFR see-and-avoid duty remains with pilot AT ALL TIMES."),
         ("10.06", "If all or part of an ATC clearance is unacceptable, a pilot should:",
          ["Comply as best as possible under the circumstances",
           "Refuse the clearance without giving a reason",
           "Acknowledge and read back only the acceptable parts",
           "Refuse the clearance and inform ATC of the pilot's intentions"],
          3, "Unacceptable clearance: REFUSE it and tell ATC what you intend to do instead"),
     ]),

    (11, "Aircraft Operations", "medium",
     """## ELT (Emergency Locator Transmitter)
- Emergency: activate IMMEDIATELY and leave on continuously
- Test: first 5 minutes of any UTC hour, maximum 5 seconds
- After hard landing: listen on 121.5 MHz to check if ELT activated accidentally
- Accidental activation: report to nearest ATS unit immediately

## Jet Blast Distances
- Medium jet at takeoff thrust: 1,200 ft danger zone
- Jumbo jet at ground idle: 600 ft | Medium jet at ground idle: 450 ft
- Executive jet at ground idle: 200 ft | Turbo-prop taxi: 60 ft

## Engine Running Unattended
- Aircraft with running engine must not be left unattended — someone must be at controls

## Thunderstorms
- Approaching storm near aerodrome: avoid ALL takeoffs and landings
- Storm near destination: HOLD in clear area until storm is well clear

## VDF (VHF Direction Finding)
- Available on pre-selected ATC/FSS frequency (no emergency required)
- Pilot is responsible for BOTH terrain AND traffic avoidance when using VDF steers

## SIRO (Simultaneous Intersecting Runway Operations)
- Land and HOLD SHORT of the intersecting runway
- Cannot comply: advise ATC IMMEDIATELY before landing""",
     [
         ("11.01", "In an emergency requiring use of the ELT, when should it be activated?",
          ["Immediately and left on continuously",
           "At the ETA shown in the flight plan",
           "During the first five minutes of each hour UTC",
           "During daylight hours only to conserve battery"],
          0, "Emergency ELT: turn ON immediately and LEAVE IT ON. Satellites and aircraft monitor 121.5 continuously."),
         ("11.02", "When may an aircraft's ELT be switched to transmit for testing purposes?",
          ["Following a hard landing",
           "During the first 5 minutes of any hour UTC, for a maximum of 5 seconds",
           "Following a component or battery change",
           "Prior to any flight, while monitoring 121.5 MHz"],
          1, "ELT test: first 5 minutes of any UTC hour, max 5 seconds — this is when SAR monitors for false alerts"),
         ("11.03", "Before shutting down, how can you verify the ELT is NOT transmitting?",
          ["Check that the ELT switch is in the OFF position",
           "Listen on 121.5 MHz for a signal",
           "Ensure the master switch is off", "Check the ELT visual warning light"],
          1, "After hard landing or suspected activation: listen on 121.5 MHz. Hear a tone? ELT is transmitting."),
         ("11.04", "Where should an accidental ELT activation be reported?",
          ["The airport manager", "The RCMP",
           "The Minister (Transport Canada)", "The nearest ATS unit"],
          3, "Accidental ELT: call the nearest ATS unit immediately so SAR isn't falsely activated"),
         ("11.05", "When an aircraft engine is running and there is no person at the controls on board:",
          ["The aircraft must remain in the pilot's sight at all times",
           "The aircraft must not be left unattended",
           "The gross weight must be below 4,409 LB", "Control locks must be installed"],
          1, "Running engine unattended: prohibited. Someone must be at the controls or nearby at all times."),
         ("11.06", "When an approaching thunderstorm threatens an aerodrome, takeoffs and landings:",
          ["Should be avoided due to wind shift and turbulence hazards",
           "Are safe if the storm is visible through to the other side",
           "Should be avoided unless the storm is moving away from the aerodrome",
           "Are safe if the storm is classified as 'light intensity'"],
          0, "Thunderstorm near aerodrome: avoid ALL takeoffs and landings. Windshear and microbursts are invisible."),
         ("11.07", "An isolated thunderstorm is near your destination aerodrome. You should:",
          ["Land, accounting for wind shear on final approach",
           "Hold over a clear area until the storm is well clear of the aerodrome",
           "Land as quickly as possible to avoid the storm",
           "Add half the wind gust factor to your landing speed"],
          1, "Storm near destination: HOLD CLEAR until storm is well past. Never rush through or under a thunderstorm."),
         ("11.08", "The blast danger area behind a medium jet at take-off thrust extends back approximately:",
          ["1,200 feet", "900 feet", "500 feet", "450 feet"],
          0, "Medium jet takeoff thrust: 1,200 ft. Jumbo ground idle: 600 ft. Medium ground idle: 450 ft."),
         ("11.09", "The blast danger area behind a jumbo jet at ground idle extends back approximately:",
          ["200 feet", "450 feet", "600 feet", "750 feet"],
          2, "Jumbo jet ground idle = 600 ft. Medium jet ground idle = 450 ft. Executive jet = 200 ft."),
         ("11.10", "The blast danger area behind a medium jet at ground idle extends back approximately:",
          ["200 feet", "450 feet", "600 feet", "750 feet"],
          1, "Medium jet ground idle = 450 ft. Above 450 ft from a medium jet at idle = safe zone."),
         ("11.11", "The blast danger area behind an executive jet at ground idle extends back approximately:",
          ["200 feet", "450 feet", "600 feet", "750 feet"],
          0, "Executive jet ground idle = 200 ft (smallest jets = least blast hazard)"),
         ("11.12", "The approximate blast danger distance behind large turbo-prop propellers during taxi (45 KT blast) is:",
          ["60 feet", "80 feet", "100 feet", "120 feet"],
          0, "Turbo-prop taxi: 60 ft blast danger zone at 45 KT. Stay clear of propeller arc areas."),
         ("11.13", "VHF direction finding stations provide homing assistance:",
          ["Only in Class B airspace", "Only after declaring an emergency on 121.5 MHz",
           "On the approach control frequency only", "On a pre-selected tower or FSS frequency"],
          3, "VDF (Direction Finding): works on a pre-selected ATC/FSS frequency — no emergency required"),
         ("11.14", "VDF steers are provided to assist VFR flights:",
          ["In times of difficulties", "On routine navigational trips",
           "Cleared for Special VFR", "In uncontrolled airspace only"],
          0, "VDF steers: available when you're lost or having difficulties — not just for emergencies"),
         ("11.15", "When uncertain of position and requesting a VDF steer, pilots should know:",
          ["Traffic avoidance is pilot's responsibility; terrain clearance will be provided",
           "Both traffic avoidance and terrain clearance remain the pilot's responsibility",
           "Both traffic avoidance and terrain clearance will be provided by ATC",
           "Traffic avoidance will be provided; terrain clearance is pilot's responsibility"],
          1, "VDF steer: ATC gives you a heading, but YOU are responsible for BOTH terrain and traffic avoidance"),
         ("11.16", "When SIRO (Simultaneous Intersecting Runway Operations) are in progress, pilots may expect clearance to:",
          ["Take off over intersecting runway traffic",
           "Take off on a specified parallel runway",
           "Land and hold short of an intersecting runway",
           "Land on a specified parallel runway"],
          2, "SIRO = land and HOLD SHORT of the intersecting runway. Requires acknowledgement and compliance."),
         ("11.17", "When issued a land-and-hold-short clearance, a pilot who cannot comply should:",
          ["Comply regardless of circumstances",
           "Taxi across after the departing or arriving aircraft has cleared",
           "Execute a 180° turn and backtrack if the aircraft inadvertently crosses",
           "Immediately inform ATC of the inability to comply"],
          3, "Can't comply with hold-short: tell ATC IMMEDIATELY before landing. Don't improvise."),
     ]),

    (12, "Regulations — General", "hard",
     """## Airspace Classes & Canadian Rules
- ADIZ: applies to ALL aircraft — file a Defence VFR flight plan before transiting
- VFR = must maintain visual reference to the surface at all times
- Control Zone: surface to 3,000 ft AGL (surrounds a controlled airport)
- Low Level Airspace: all Canadian airspace below 18,000 ft ASL (Class A starts at FL180)

## VFR Minima (Uncontrolled)
- Helicopter <1,000 ft AGL: 1 mile visibility; clear of cloud
- Aeroplane <1,000 ft AGL uncontrolled: clear of cloud (no specific horizontal distance)
- Dropping from aircraft: prohibited only if it creates a HAZARD

## VFR Cruising Altitudes (above 3,000 ft AGL)
- Eastbound (000°–179° magnetic track): odd thousands + 500 ft (3,500, 5,500, 7,500…)
- Westbound (180°–359° magnetic track): even thousands + 500 ft (4,500, 6,500, 8,500…)
- Based on MAGNETIC TRACK, not heading

## Key Regulations
- Night (Canada): end of evening civil twilight → beginning of morning civil twilight
- Day (Canada): beginning of morning civil twilight → end of evening civil twilight
- Low flying: 500 ft from persons/vessels/vehicles/structures over non-populous areas
- Helicopter over built-up area: 1,000 ft above obstacles within 500 ft radius
- Alcohol: 12 hours minimum after consumption before acting as crew (CARs 602.03)
- Aerobatics: permitted in Class F advisory with 3 miles visibility
- Formation flying: pre-arranged by ALL pilots-in-command
- Licence on demand: peace officers AND immigration officers""",
     [
         ("12.01", "ADIZ (Air Defence Identification Zone) rules normally apply:",
          ["Only to aircraft flying above 12,500 feet ASL",
           "Only to aircraft flying at 180 KT true airspeed or more",
           "Only to southbound aircraft", "To all aircraft"],
          3, "Canadian ADIZ: applies to ALL aircraft — file a Defence VFR flight plan before transiting"),
         ("12.02", "When operating in accordance with VFR, aircraft shall be flown:",
          ["Clear of aerodrome traffic zones", "Clear of control zones",
           "With visual reference to the surface", "In compliance with all of the above"],
          2, "VFR = Visual Flight Rules: must maintain VISUAL reference to the SURFACE at all times"),
         ("12.03", "Normally, a helicopter in uncontrolled airspace at less than 1,000 feet AGL may operate during the day in a flight visibility of not less than:",
          ["1/2 mile", "1 mile", "2 miles", "3 miles"],
          1, "Helicopter <1,000 ft AGL uncontrolled: 1 mile visibility. (Aeroplanes need 2 miles.)"),
         ("12.04", "What distance from cloud must an aircraft maintain when flying below 1,000 feet AGL in uncontrolled airspace?",
          ["At least 2,000 feet horizontally and 500 feet vertically",
           "At least 1 mile horizontally and 500 feet vertically",
           "At least 2 miles horizontally and 500 feet vertically", "Clear of cloud"],
          3, "Below 1,000 ft AGL uncontrolled: clear of cloud (no specific distance — just stay out of it)"),
         ("12.05", "No person shall drop anything from an aircraft in flight:",
          ["Which will create a hazard to persons or property on the surface",
           "Unless approval has been granted by the Minister",
           "Unless over an authorized jettison area",
           "Unless it is attached to a parachute"],
          0, "Dropping from aircraft: only prohibited if it creates a HAZARD. Skydivers and airshow drops are fine."),
         ("12.06", "A person may conduct aerobatic manoeuvres in an aircraft:",
          ["Over an airport provided the appropriate frequency is monitored",
           "Over the suburban area of a city above 2,000 feet AGL",
           "Within Class F advisory airspace when flight visibility is 3 miles or greater",
           "Within Class C airspace when visibility is 1 mile or greater"],
          2, "Aerobatics: permitted in Class F advisory airspace with 3 miles visibility (and specific altitude minima)"),
         ("12.07", "CARs state that after the consumption of any alcoholic beverage, no person shall act as a crew member of an aircraft within:",
          ["8 hours", "12 hours", "24 hours", "36 hours"],
          1, "Bottle to throttle: 12 hours minimum. Also: no flying with BAC over 0.04% (CARs 602.03)"),
         ("12.08", "In Canada, 'Day' is defined as the period of time between:",
          ["Sunrise and sunset",
           "One hour before sunrise and one hour after sunset",
           "The beginning of morning civil twilight and the end of evening civil twilight",
           "The end of morning civil twilight and the beginning of evening civil twilight"],
          2, "Canadian 'Day': from start of MORNING civil twilight to end of EVENING civil twilight (wider than sunrise/set)"),
         ("12.09", "In Canada, 'Night' is defined as the period of time between:",
          ["Sunset and sunrise",
           "The beginning of evening civil twilight and the end of morning civil twilight",
           "One hour after sunset and one hour before sunrise",
           "The end of evening civil twilight and the beginning of morning civil twilight"],
          3, "Canadian 'Night': from END of evening civil twilight to BEGINNING of morning civil twilight (narrower than day)"),
         ("12.10", "Formation flying is permitted only if such flights:",
          ["Have been pre-arranged by the pilots-in-command of all participating aircraft",
           "Are conducted above 3,000 feet AGL",
           "Are conducted by commercial pilots only",
           "Are led by a pilot whose licence is endorsed for formation flight"],
          0, "Formation flying: pre-arranged by ALL pilots-in-command — no spontaneous formation!"),
         ("12.11", "Flight through active Class F airspace with the designator CYR (Restricted):",
          ["May be undertaken only by aircraft equipped with a two-way radio and transponder",
           "Is restricted to military aircraft under authority of the Minister of National Defence",
           "Is approved only for aircraft on IFR flight plans under positive radar control",
           "Is permitted only in accordance with permission from the user agency"],
          3, "CYR = Restricted airspace. Get permission from the USER AGENCY before entering."),
         ("12.12", "Which statement is correct with regard to Class F 'advisory' airspace?",
          ["A transient aircraft entering active advisory airspace requires a serviceable transponder",
           "Non-participating VFR aircraft are encouraged to avoid advisory airspace during active periods",
           "Aircraft must have a two-way radio to enter active advisory airspace",
           "Only military aircraft may enter advisory airspace"],
          1, "CYA = Advisory airspace. Non-participants ENCOURAGED (not required) to avoid it when active."),
         ("12.13", "Unless taking off or landing, no person shall fly a helicopter over a built-up area except at an altitude that permits an emergency landing, and such altitude shall not be less than ___ above the highest obstacle within a horizontal radius of ___ from the aircraft:",
          ["3,000 feet / 1 mile", "2,000 feet / 1,000 feet",
           "1,000 feet / 500 feet", "500 feet / 500 feet"],
          2, "Helicopter over built-up area: 1,000 ft above obstacles within 500 ft radius"),
         ("12.14", "Over non-populous areas or open water, a pilot may not fly an aircraft at a distance less than ___ feet from any person, vessel, vehicle, or structure:",
          ["200", "500", "1,000", "2,000"],
          1, "Low flying over non-populous areas: 500 ft from any person/vessel/vehicle/structure"),
         ("12.15", "No person shall cause an aircraft to take off from or land on any surface within the built-up area of any city or town unless:",
          ["The aircraft is multi-engined",
           "All obstacles can be cleared by at least 500 feet",
           "That surface is an airport or military aerodrome",
           "Noise abatement procedures are followed"],
          2, "Takeoff/landing in city: only from/on an AIRPORT or MILITARY AERODROME"),
         ("12.16", "What is the height AGL above which a VFR aircraft must conform to the Cruising Altitudes Order?",
          ["700 feet", "2,200 feet", "3,000 feet", "3,500 feet"],
          2, "VFR cruising altitudes apply ABOVE 3,000 ft AGL. Below 3,000 ft AGL: fly any altitude."),
         ("12.17", "A VFR aircraft cruising above 3,000 feet AGL on a magnetic track of 290° shall be flown at an altitude of:",
          ["Even thousand feet", "Even thousand plus 500 feet",
           "Odd thousand feet", "Odd thousand plus 500 feet"],
          1, "Track 180°–359° (westbound) = EVEN thousand + 500 ft. Track 000°–179° (eastbound) = ODD + 500 ft."),
         ("12.18", "Selection of a VFR cruising altitude in Southern Domestic Airspace should be based on the:",
          ["True track", "Magnetic track", "True heading", "Magnetic heading"],
          1, "Cruising altitude = based on MAGNETIC TRACK (your ground path), not heading (aircraft direction)"),
         ("12.19", "Every pilot licence or permit holder shall, on demand, produce it for inspection by persons authorized by the Minister, by peace officers and:",
          ["FSS operators", "Transport Canada airport managers",
           "Immigration officers", "All of the above"],
          2, "CARs 401.03: licence on demand by peace officers AND immigration officers (federally authorized)"),
         ("12.20", "Low Level Airspace is defined as all airspace:",
          ["Extending upwards from 2,200 feet AGL within designated airways",
           "Extending upwards from 700 feet AGL within designated airways",
           "Extending upwards from the surface within designated airways",
           "Within the Canadian Domestic Airspace below 18,000 feet ASL"],
          3, "Low Level Airspace = all Canadian airspace below 18,000 ft ASL (Class A starts at FL180)"),
         ("12.21", "A Control Zone normally is controlled airspace extending upwards from:",
          ["2,200 feet above the surface", "700 feet above the surface",
           "The surface of the earth to 3,000 feet AGL",
           "A specified height above the surface"],
          2, "Control Zone: surface to 3,000 ft AGL (surrounds a controlled airport, includes the circuit altitude)"),
     ]),

    (13, "Controlled Airspace", "medium",
     """## Airspace Classes
- Controlled Airspace = where an ATC SERVICE is provided (Classes A, B, C, D, E)
- Class B: high-density terminal — VFR requires explicit ATC clearance
- Class C Terminal Control Area: establish AND maintain continuous two-way radio with ATC
- Class D Control Zone (uncontrolled airport with advisory zone): two-way radio required
- Special VFR: special clearance below normal VFR minimums, only within a Control Zone

## VFR Cloud Clearances in Controlled Airspace
- Standard: 500 ft vertical, 1 NM horizontal from cloud
- Low-level airway: 3 miles visibility minimum

## Special VFR (SVFR)
- Aeroplane: minimum 1 mile visibility | Helicopter: minimum 1/2 mile visibility
- Only within a Control Zone
- Contact tower BEFORE entering Control Zone — not after

## Key Procedures
- Arriving VFR: contact ATC BEFORE entering Control Zone
- Class C airspace: GET a clearance before entering (contact ATC and wait)
- Class B airspace: VFR only in accordance with ATC clearance""",
     [
         ("13.01", "What does 'Controlled Airspace' mean?",
          ["Control Zone regulations are in force", "Security regulations are in force",
           "Special VFR flight only is permitted", "An ATC service is provided"],
          3, "Controlled Airspace = airspace where ATC SERVICE is provided (Classes A, B, C, D, E)"),
         ("13.02", "When in VFR flight within controlled airspace, how far must a pilot remain clear of cloud?",
          ["500 feet vertically and 1 mile horizontally",
           "500 feet vertically and 2,000 feet horizontally",
           "1,000 feet vertically and 1 mile horizontally",
           "1,000 feet vertically and 3 miles horizontally"],
          0, "VFR in controlled airspace: 500 ft vertical, 1 NM horizontal from cloud (at low altitudes)"),
         ("13.03", "What is the minimum flight visibility for VFR flight within a low level airway?",
          ["1 mile", "1½ miles", "2 miles", "3 miles"],
          3, "Low level airway VFR: 3 miles visibility minimum (controlled airspace requirement)"),
         ("13.04", "When in VFR flight within a Control Zone, how far must a pilot remain clear of cloud?",
          ["500 feet vertically and 2,000 feet horizontally",
           "500 feet vertically and 1 mile horizontally",
           "1,000 feet vertically and 1 mile horizontally",
           "1,000 feet vertically and 3 miles horizontally"],
          1, "VFR in Control Zone: 500 ft vertical, 1 mile horizontal from cloud (same as other controlled airspace)"),
         ("13.05", "A VFR cross-country pilot wishing to cross through any part of a Class C Control Zone should:",
          ["Advise the associated Flight Service Station",
           "Monitor the Approach Control frequency",
           "Advise ATC of intentions and obtain a clearance",
           "Conform with the circuit direction at that airport"],
          2, "Class C airspace: contact ATC and GET A CLEARANCE before entering. Not optional."),
         ("13.06", "For an aeroplane equipped with a functioning two-way radio, transiting a Control Zone under day Special VFR, the minimum flight visibility is:",
          ["1/2 mile", "1 mile", "2 miles", "3 miles"],
          1, "SVFR aeroplane: 1 mile visibility minimum. SVFR helicopter: 1/2 mile minimum."),
         ("13.07", "For a helicopter equipped with a functioning two-way radio, transiting a Control Zone under day Special VFR, the minimum flight visibility is:",
          ["1 mile", "1/2 mile", "2 miles", "1/2 mile and not less than 500 feet AGL"],
          1, "SVFR helicopter: 1/2 mile visibility. Helicopters can manoeuvre more precisely than aeroplanes."),
         ("13.08", "An aircraft flying in accordance with Special VFR would be flying within:",
          ["A Control Zone", "An Aerodrome Traffic Zone",
           "A Terminal Control Area", "An airway"],
          0, "Special VFR only exists within a CONTROL ZONE — it's a special clearance below normal VFR minimums"),
         ("13.09", "When should an arriving VFR flight make its initial radio contact with the control tower?",
          ["Upon entering the Aerodrome Traffic Zone",
           "Prior to entering the Control Zone",
           "Immediately prior to joining the circuit",
           "Immediately after entering the Control Zone"],
          1, "Contact tower BEFORE entering Control Zone — not after. Get clearance before the boundary."),
         ("13.10", "When is VFR flight within Class B airspace permitted?",
          ["Only when flight visibility is 5 miles or better",
           "For all aircraft except gliders and balloons",
           "If the pilot holds a Class B Airspace Endorsement",
           "In accordance with an ATC clearance"],
          3, "Class B airspace (high-density TCA): VFR flight requires an explicit ATC clearance"),
         ("13.11", "When should the pilot of an arriving VFR flight make initial radio contact with a control tower in Class C airspace?",
          ["Immediately after entering the Control Zone",
           "10 NM outside the Control Zone",
           "Prior to entering the Control Zone",
           "Immediately prior to joining the circuit"],
          2, "Class C: contact ATC BEFORE entering the Control Zone boundary — same as Class B/D"),
         ("13.12", "Unless otherwise authorized, a pilot on VFR flight within a Class C Terminal Control Area must:",
          ["Exit the airspace when weather deteriorates below VFR limits",
           "Contact ATC only when transiting the associated Control Zone",
           "Establish and maintain radio communication with the ATC unit",
           "Contact Radar Service only when taking off or landing"],
          2, "Class C TCA: establish AND maintain continuous two-way radio contact with ATC at all times"),
     ]),

    (14, "Aviation Occurrences", "easy",
     """## TSB (Transportation Safety Board)
- Purpose of investigations: PREVENT future accidents — NOT to assign blame or prosecute
- Accident reporting procedures: in A.I.P. Canada

## Reporting Requirements
- Report to TSB: immediately, by quickest means available (phone, radio, any ATS unit)
- Must report when: serious/fatal injury, significant aircraft damage, OR aircraft missing
- Missing aircraft = reportable ACCIDENT until proven otherwise

## Wreck Preservation
- Do NOT move aircraft wreck without ministerial approval EXCEPT to:
  - Rescue survivors
  - Avoid danger to persons or property
  - Prevent fire or further destruction""",
     [
         ("14.01", "What is the main purpose of investigating aircraft accidents or incidents?",
          ["To apportion blame and liability",
           "To determine the adequacy of insurance regulations",
           "To enforce regulations and prosecute violators",
           "To prevent recurrences"],
          3, "TSB investigations: PREVENT future accidents — not to assign blame or prosecute"),
         ("14.02", "Civil aviation accident reporting procedures can be found in:",
          ["A.I.P. Canada", "Canadian Aviation Regulations (CARs)",
           "Canada Flight Supplement (CFS)", "Aviation Safety Manual"],
          0, "Accident reporting procedures: in A.I.P. Canada (Aeronautical Information Publication)"),
         ("14.03", "How quickly must pilots or operators report aircraft accidents to the TSB (Transportation Safety Board)?",
          ["Within 7 days by registered mail", "Within 24 hours by telephone",
           "Within 48 hours by facsimile",
           "As soon as possible by the quickest means available"],
          3, "TSB accident report: immediately, by quickest means — phone, radio, any ATS unit"),
         ("14.04", "When must the TSB be notified of a reportable aviation accident?",
          ["When persons sustain serious or fatal injury",
           "When the aircraft sustains damage requiring major repair",
           "When the aircraft is missing or inaccessible",
           "When any of the above conditions exist"],
          3, "Report to TSB if: serious injury, significant aircraft damage, OR aircraft missing — any one of these"),
         ("14.05", "Under what circumstances may an aircraft wreck be moved following an accident, without ministerial approval?",
          ["To rescue survivors", "To avoid danger to persons or property",
           "To prevent fire or further destruction", "To implement any of the above"],
          3, "Move the wreck only for: rescue, prevent danger, or prevent fire. Never to recover property or logs."),
         ("14.06", "How does the TSB classify a missing or inaccessible aircraft until proven otherwise?",
          ["A reportable aviation incident",
           "An occurrence not requiring reporting",
           "An aviation incident not requiring reporting",
           "A reportable aviation accident"],
          3, "Missing aircraft = reportable ACCIDENT until proven otherwise — SAR can begin immediately"),
     ]),
]

# ROC-A placeholder sections (AI will populate questions)
ROCA_SECTIONS = [
    (1, "Radio Regulations", "medium",
     """## Canadian Radio Regulations for Aviation
- The Radiocommunication Act and its regulations govern radio use in Canada
- Aviation radio operators require a Restricted Operator Certificate — Aeronautical (ROC-A)
- The ROC-A is issued by ISED (Innovation, Science and Economic Development Canada)
- Required for all persons who operate aircraft radio equipment

*(Questions for this section will be generated by AI)*"""),
    (2, "Phonetic Alphabet & Q Codes", "easy",
     """## NATO Phonetic Alphabet
- Used for all aviation radio communications to avoid misunderstandings
- Alpha Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett
- Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu

## Common Q Codes
- QNH: altimeter setting to read altitude above sea level
- QFE: altimeter setting to read height above aerodrome
- QNE: standard pressure setting (1013.25 hPa / 29.92 inHg)

*(Questions for this section will be generated by AI)*"""),
    (3, "Distress & Urgency Procedures", "medium",
     """## Distress Procedures
- MAYDAY: spoken 3 times — immediate grave danger
- PAN PAN: spoken 3 times — urgency, no immediate danger
- 121.5 MHz: international aeronautical emergency frequency

*(Questions for this section will be generated by AI)*"""),
    (4, "Communication Procedures", "medium",
     """## Standard Phraseology
- Use standard phraseology to reduce ambiguity
- Read back all ATC clearances and instructions
- Maintain listening watch on appropriate frequencies

*(Questions for this section will be generated by AI)*"""),
    (5, "Radio Equipment & Propagation", "hard",
     """## VHF Radio Characteristics
- VHF (30–300 MHz): line-of-sight propagation
- Range limited by altitude: higher = farther
- 108–137 MHz: aviation VHF band

*(Questions for this section will be generated by AI)*"""),
]
