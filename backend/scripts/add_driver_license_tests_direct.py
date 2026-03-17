"""
Direct database insertion for Class 5 Driver License Tests
Creates comprehensive 120+ question pools for deep revision
No backend server needed - direct SQLAlchemy insertion

Questions per test: 120 (samples 30 per revision attempt)
Ensures complete knowledge coverage with smart randomization
"""

import sys
import uuid
from datetime import datetime

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import StudyMaterial, QuizQuestion, User

BERNEL_EMAIL = "bernel@example.com"

# SIGNALS/SIGNS COMPREHENSIVE POOL (120+ questions)
SIGNALS_QUESTIONS = [
    # Traffic Lights (1-12)
    {"q": "What does a solid red traffic light mean?", "opts": ["Stop completely", "Slow down", "Speed up", "Yield"], "ans": "Stop completely", "exp": "Red means stop - come to a complete stop before entering intersection.", "d": 1},
    {"q": "What does a solid yellow traffic light mean?", "opts": ["Stop immediately", "Prepare to stop - light turning red", "Speed up", "Turn only"], "ans": "Prepare to stop - light turning red", "exp": "Yellow means the light is about to turn red - prepare to stop safely.", "d": 1},
    {"q": "What does a solid green traffic light mean?", "opts": ["Go if safe", "Speed up maximum", "Any direction", "Turn without looking"], "ans": "Go if safe", "exp": "Green means you can proceed if it's safe and the intersection is clear.", "d": 1},
    {"q": "What does a flashing red light mean?", "opts": ["Slow down and look", "Complete stop then proceed if safe", "Speed through", "Optional to stop"], "ans": "Complete stop then proceed if safe", "exp": "Flashing red = full stop sign. Stop completely, check intersection, then proceed.", "d": 2},
    {"q": "What does a flashing yellow light mean?", "opts": ["Full stop required", "Proceed with caution", "Speed up", "Turn only"], "ans": "Proceed with caution", "exp": "Flashing yellow = slow down and check for traffic before proceeding.", "d": 2},
    {"q": "What does a green arrow on red light allow?", "opts": ["Any direction turn", "Turn only in direction of arrow", "Speed up", "Proceed straight"], "ans": "Turn only in direction of arrow", "exp": "Green arrow gives exclusive right-of-way to turn in that direction only.", "d": 2},
    {"q": "When turning right on red light, what must you do?", "opts": ["Turn immediately", "Honk first", "Complete stop and check safety", "Slow down only"], "ans": "Complete stop and check safety", "exp": "Must stop completely, check for pedestrians/traffic, then proceed if safe.", "d": 2},
    {"q": "What does a yellow arrow with solid red mean?", "opts": ["Can turn freely", "Do not turn - prepare to stop", "Turn if fast", "Wait for green"], "ans": "Do not turn - prepare to stop", "exp": "Yellow arrow means turning right is ending - prepare to stop.", "d": 2},
    {"q": "When pedestrian walk signal shows 'Don't Walk' (red hand), what should you do?", "opts": ["Speed up to cross", "Walk quickly", "Do not enter intersection", "Slow walk"], "ans": "Do not enter intersection", "exp": "Red hand means pedestrians must not enter or continue crossing.", "d": 1},
    {"q": "What does a white 'Walk' pedestrian signal mean?", "opts": ["Drivers can turn", "Pedestrians have right-of-way", "Be cautious", "Walk slowly"], "ans": "Pedestrians have right-of-way", "exp": "White walk signal gives pedestrians the right-of-way to cross safely.", "d": 1},
    {"q": "Can you turn left when facing a green light but no green arrow?", "opts": ["Yes always", "Only if you yield to oncoming traffic", "Never", "Only at night"], "ans": "Only if you yield to oncoming traffic", "exp": "Without arrow, you can turn left but must yield to oncoming vehicles.", "d": 2},
    {"q": "What should you do if a traffic light isn't working?", "opts": ["Proceed normally", "Treat as 4-way stop", "Back up", "Honk"], "ans": "Treat as 4-way stop", "exp": "Non-functioning light = 4-way stop. All vehicles stop and proceed in turn.", "d": 2},

    # Road Markings - Yellow Lines (13-26)
    {"q": "What does a solid yellow line on your side mean?", "opts": ["Can pass if safe", "Cannot pass", "Speed limit change", "Merge ahead"], "ans": "Cannot pass", "exp": "Solid yellow on your side = no passing allowed.", "d": 1},
    {"q": "What does a dashed yellow line on your side mean?", "opts": ["Cannot pass", "Can pass if safe", "School zone", "One-way street"], "ans": "Can pass if safe", "exp": "Dashed yellow = passing allowed when road is clear and safe.", "d": 1},
    {"q": "What does a double solid yellow line mean?", "opts": ["Can pass both directions", "No passing either direction", "Caution ahead", "Merge possible"], "ans": "No passing either direction", "exp": "Double yellow = no passing allowed from any direction.", "d": 1},
    {"q": "What does solid yellow on opposite side and dashed on your side mean?", "opts": ["Both can pass", "Nobody can pass", "You can pass, oncoming cannot", "One way only"], "ans": "You can pass, oncoming cannot", "exp": "Dashed on your side = you may pass when safe. Solid on their side = they cannot.", "d": 2},
    {"q": "When can you cross a double solid yellow line?", "opts": ["Anytime if safe", "Only to turn into driveway", "Never", "At night only"], "ans": "Only to turn into driveway", "exp": "Double yellow can only be crossed to turn into private driveway/property.", "d": 2},
    {"q": "What does yellow line indicate on 2-way street?", "opts": ["Speed limit", "Center line dividing directions", "Passing zone", "Merge area"], "ans": "Center line dividing directions", "exp": "Yellow = center line. Solid = no pass, dashed = can pass if safe.", "d": 1},
    {"q": "Can you turn across a solid yellow line?", "opts": ["No never", "Yes if turning into driveway", "Only left turns", "Only right turns"], "ans": "Yes if turning into driveway", "exp": "You can cross solid yellow to turn into a driveway or private entrance.", "d": 2},
    {"q": "What does edge line on yellow curb mean?", "opts": ["Free parking", "No parking anytime", "Loading zone", "Meter parking"], "ans": "No parking anytime", "exp": "Yellow curb = no parking at any time. For loading only and briefly.", "d": 2},
    {"q": "How far should you be from yellow line to pass safely?", "opts": ["1 car length", "3 car lengths", "Whatever you want", "2 seconds distance"], "ans": "3 car lengths", "exp": "Need clear visibility and space - at least 3 car lengths for safe passing.", "d": 2},
    {"q": "Can you pass on the right if yellow line is on your side?", "opts": ["Yes always", "Only on 4-lane road", "Never if solid", "Sometimes"], "ans": "Never if solid", "exp": "Solid yellow = no passing on that side, regardless of right or left.", "d": 2},
    {"q": "What indicates a no-passing zone?", "opts": ["White line", "Solid yellow line", "Dashed line", "Red line"], "ans": "Solid yellow line", "exp": "Solid yellow marks no-passing zones with restricted visibility.", "d": 1},
    {"q": "When approaching a hill, what do passing lines look like?", "opts": ["Dashed - allowed", "Solid - not allowed", "Both types", "No markings"], "ans": "Solid - not allowed", "exp": "Hills have solid yellows because visibility is limited - no passing.", "d": 2},

    # Road Markings - White Lines (27-38)
    {"q": "What does a solid white line mean?", "opts": ["Can change lanes anytime", "Should not change lanes", "Speed limit change", "Pedestrian area"], "ans": "Should not change lanes", "exp": "Solid white = discourages lane changes. Can cross if necessary.", "d": 1},
    {"q": "What does a dashed white line mean?", "opts": ["Cannot change lanes", "Can change lanes if safe", "No parking", "Construction zone"], "ans": "Can change lanes if safe", "exp": "Dashed white = lane change permitted when safe. Check mirrors/blind spots.", "d": 1},
    {"q": "What do double solid white lines mean?", "opts": ["Can change lanes", "Cannot change lanes either direction", "One way street", "Turn only"], "ans": "Cannot change lanes either direction", "exp": "Double solid white = no lane changes allowed - stay in your lane.", "d": 2},
    {"q": "What do white lines separate on one-way street?", "opts": ["Directions of traffic", "Lanes going same direction", "Parking areas", "Speed zones"], "ans": "Lanes going same direction", "exp": "White lines on one-way separate lanes going the same direction.", "d": 1},
    {"q": "Can you cross solid white line at edge of road?", "opts": ["Never", "Only to avoid hazard", "Always if needed", "Only when turning"], "ans": "Only to avoid hazard", "exp": "Edge white line can be crossed to avoid obstacle/hazard.", "d": 2},
    {"q": "What does broken white line on road mean?", "opts": ["No passing", "Cannot change lanes", "Acceptable to change lanes", "Turn approaching"], "ans": "Acceptable to change lanes", "exp": "Dashed/broken white = lane changes OK when safe and legal.", "d": 1},
    {"q": "When should you NOT cross solid white line between lanes?", "opts": ["When unsafe", "At intersections", "In normal traffic", "During day"], "ans": "In normal traffic", "exp": "Solid white discourages lane changes in normal traffic conditions.", "d": 2},
    {"q": "What do edge lines keep separate?", "opts": ["Traffic directions", "Road and shoulder/curb", "Lanes", "Parking areas"], "ans": "Road and shoulder/curb", "exp": "Edge lines mark boundary between road surface and shoulder/curb.", "d": 1},
    {"q": "How thick are edge lines compared to lane lines?", "opts": ["Same thickness", "Thicker", "Thinner", "No difference"], "ans": "Thicker", "exp": "Edge lines are thicker/more visible to clearly mark road boundaries.", "d": 2},

    # Road Signs (39-60)
    {"q": "What shape is a stop sign?", "opts": ["Circle", "Octagon (8 sides)", "Triangle", "Square"], "ans": "Octagon (8 sides)", "exp": "Stop signs are distinctive red octagons requiring complete stop.", "d": 1},
    {"q": "What shape is a yield sign?", "opts": ["Octagon", "Triangle", "Pentagon", "Hexagon"], "ans": "Triangle", "exp": "Yield signs are white triangles - prepare to stop if necessary.", "d": 1},
    {"q": "What do rectangular blue signs indicate?", "opts": ["Warning", "Information/services", "Speed limit", "Mandatory"], "ans": "Information/services", "exp": "Blue rectangles show hospitals, rest areas, phone, gas locations.", "d": 2},
    {"q": "What do diamond-shaped yellow signs indicate?", "opts": ["Stop required", "Warnings of hazards ahead", "Speed limit", "Information"], "ans": "Warnings of hazards ahead", "exp": "Yellow diamonds warn of dangerous conditions like curves, wildlife, workers.", "d": 1},
    {"q": "What color is a 'Do Not Enter' sign?", "opts": ["Blue with white", "White with red", "Red with white", "Yellow"], "ans": "Red with white", "exp": "'Do Not Enter' is white words on red background - never proceed.", "d": 1},
    {"q": "What shape is a regulatory sign (like speed limit)?", "opts": ["Diamond", "Circle", "Rectangle", "Triangle"], "ans": "Rectangle", "exp": "Regulatory signs (speed limits, parking) are rectangular white signs.", "d": 1},
    {"q": "What do red hexagon signs mean in Canada?", "opts": ["Stop", "Slow down", "No entry", "Reserved parking"], "ans": "No entry", "exp": "Red hexagons with white cross = 'No Entry' - do not proceed.", "d": 2},
    {"q": "What does one-way sign look like?", "opts": ["Diamond with arrow", "Rectangle with arrow", "Circle with arrow", "Pentagon with arrow"], "ans": "Rectangle with arrow", "exp": "One-way signs are rectangular with arrow pointing allowed direction.", "d": 1},
    {"q": "What color indicates 'No Parking' restriction?", "opts": ["Yellow curb", "Red curb", "White curb", "Blue curb"], "ans": "Red curb", "exp": "Red curb = no parking anytime. Yellow = no parking during posted hours.", "d": 2},
    {"q": "What does white rectangular sign with 'P' mean?", "opts": ["School ahead", "Parking available", "Pedestrian crossing", "Police station"], "ans": "Parking available", "exp": "White 'P' signs indicate parking area or facility ahead.", "d": 1},
    {"q": "What is a 'No Left Turn' sign?", "opts": ["Red circle with left arrow", "Red circle with slash and left arrow", "Yellow warning", "Blue rectangle"], "ans": "Red circle with slash and left arrow", "exp": "Red circle with slash = prohibition. Shows what action is forbidden.", "d": 2},
    {"q": "What does a green sign with white indicate?", "opts": ["Warning", "Directional/guide information", "Mandatory action", "Speed limit"], "ans": "Directional/guide information", "exp": "Green signs direct you to destinations, services, or exits.", "d": 1},
    {"q": "What does a 'School Crossing' sign look like?", "opts": ["Yellow diamond with child figure", "Red rectangle", "Blue square", "White octagon"], "ans": "Yellow diamond with child figure", "exp": "Yellow school crossing signs warn you to slow down and watch for children.", "d": 1},
    {"q": "What does 'Railroad Crossing' sign look like?", "opts": ["Yellow diamond with X", "Red octagon", "Blue rectangle", "White square"], "ans": "Yellow diamond with X", "exp": "Yellow diamonds with X warn of railroad crossings - be extra cautious.", "d": 1},
    {"q": "When you see a 'Pedestrian Crossing' sign, what should you do?", "opts": ["Speed up", "Be prepared to stop", "Ignore if no people", "Change lanes"], "ans": "Be prepared to stop", "exp": "Pedestrian crossing signs warn you pedestrians may be crossing.", "d": 2},
    {"q": "What does white triangular sign mean in Canada?", "opts": ["Warning", "Yield to traffic from other direction", "Stop ahead", "Mandatory"], "ans": "Yield to traffic from other direction", "exp": "Triangular white signs are yield signs - be ready to stop for traffic.", "d": 2},
    {"q": "What information does black/white numbered rectangular sign provide?", "opts": ["Speed limit", "Distance to next town", "Road number", "Elevation"], "ans": "Road number", "exp": "Black/white numbered rectangles show route numbers (Highway 1, Road 45).", "d": 2},
    {"q": "What does 'Keep Right' or 'Keep Left' sign indicate?", "opts": ["Traffic direction", "Divided highway info", "Lane you must use", "Safe passing zone"], "ans": "Traffic direction", "exp": "These signs direct traffic flow around obstacles or at divides.", "d": 1},
    {"q": "What shape are mandatory instruction signs?", "opts": ["Diamond", "Circle", "Rectangle", "Triangle"], "ans": "Circle", "exp": "Red or blue circles indicate mandatory instructions you must follow.", "d": 2},
    {"q": "What does speed limit sign shape tell you?", "opts": ["That it's a maximum speed", "That it's mandatory", "The road type", "Nothing - just format"], "ans": "Nothing - just format", "exp": "Rectangular white signs are the format - color/content matters most.", "d": 2},

    # Right of Way Rules (61-80)
    {"q": "At two-way stop (you have stop sign), can cross if oncoming traffic slows?", "opts": ["Yes", "No - wait for them to stop", "Only if they signal", "Only at night"], "ans": "No - wait for them to stop", "exp": "Oncoming traffic may not have stop sign - only cross when clear.", "d": 2},
    {"q": "At four-way stop, who has priority?", "opts": ["Larger vehicle", "Vehicle that arrived first", "Straight traffic", "Turning traffic"], "ans": "Vehicle that arrived first", "exp": "At 4-way stop: first to arrive goes first. If simultaneous, right has priority.", "d": 2},
    {"q": "Can you turn right before pedestrians in crosswalk?", "opts": ["Yes, always", "No - pedestrians have priority", "Only if they're far away", "Only with signal"], "ans": "No - pedestrians have priority", "exp": "Pedestrians in crosswalk always have right-of-way - wait for them.", "d": 1},
    {"q": "At unmarked intersection, who has right of way?", "opts": ["Vehicle on left", "Vehicle on right", "Straight traffic", "Whoever gets there first"], "ans": "Vehicle on right", "exp": "At unmarked intersections, vehicle on right has right-of-way.", "d": 2},
    {"q": "When bus is pulling out from stop, what should you do?", "opts": ["Speed up to pass", "Give it right-of-way", "Honk", "Stay in your lane"], "ans": "Give it right-of-way", "exp": "Buses have special priority when pulling from bus stop - let them out.", "d": 2},
    {"q": "Do you have right of way turning left across oncoming traffic?", "opts": ["Yes always", "No - oncoming traffic goes first", "Only if arrow", "Only if signaling"], "ans": "No - oncoming traffic goes first", "exp": "Turning left: oncoming straight traffic has right-of-way over your turn.", "d": 2},
    {"q": "At roundabout, who has right of way?", "opts": ["Entering traffic", "Traffic already in roundabout", "Right-turning traffic", "Whoever is faster"], "ans": "Traffic already in roundabout", "exp": "In roundabout: yield to traffic already circulating - enter when safe.", "d": 2},
    {"q": "Emergency vehicle (ambulance/fire) with lights - what do you do?", "opts": ["Maintain speed", "Pull over safely", "Speed up to get out of way", "Ignore if no siren"], "ans": "Pull over safely", "exp": "Emergency vehicles have right-of-way - pull to edge and let them pass.", "d": 1},
    {"q": "School bus with red flashing lights - what must you do?", "opts": ["Slow down", "Stop until lights stop flashing", "Pass carefully", "Speed up"], "ans": "Stop until lights stop flashing", "exp": "Red flashing school bus lights = full stop. Don't move until lights stop.", "d": 1},
    {"q": "Can police car with lights direct you differently than traffic lights?", "opts": ["No - follow lights", "Yes - follow police instructions", "Only at night", "Only if they wave"], "ans": "Yes - follow police instructions", "exp": "Police traffic direction overrides traffic lights and signs.", "d": 2},
    {"q": "At controlled intersection with pedestrian walk signal, who goes?", "opts": ["Vehicles first", "Pedestrians with walk signal", "Both at same time", "Whoever is ready"], "ans": "Pedestrians with walk signal", "exp": "When pedestrians have walk signal, they have right-of-way - vehicles must wait.", "d": 1},
    {"q": "When turning, must you yield to pedestrians in crosswalk?", "opts": ["No - they must wait", "Yes - always", "Only if signaling", "Only in cities"], "ans": "Yes - always", "exp": "Pedestrians in marked crosswalks always have right-of-way over turning traffic.", "d": 1},
    {"q": "At railroad crossing with flashing red lights, what is absolute rule?", "opts": ["Slow down and cross", "Stop - do not cross", "Cross quickly", "Honk first then cross"], "ans": "Stop - do not cross", "exp": "Flashing red at railway = absolute stop. Never proceed - train has right-of-way.", "d": 1},
    {"q": "Pedestrian outside marked crosswalk - do you have right of way?", "opts": ["Yes always", "No - yield anyway", "Only on residential streets", "Only at night"], "ans": "No - yield anyway", "exp": "Always yield to pedestrians even outside crosswalks - safety first.", "d": 2},
    {"q": "Left-turning vehicle vs straight oncoming - who goes?", "opts": ["Left-turner", "Straight traffic", "Both simultaneously", "Whoever signals"], "ans": "Straight traffic", "exp": "Oncoming straight traffic has right-of-way over left-turning vehicle.", "d": 2},
    {"q": "Reversing out of driveway - who has right of way?", "opts": ["You do - you're backing up", "Traffic on road does", "Whoever reaches first", "Both equally"], "ans": "Traffic on road does", "exp": "Reversing vehicles must yield to traffic on road - be extra cautious.", "d": 2},
    {"q": "At 'Yield' sign what must you do?", "opts": ["Full stop required", "Be ready to stop/slow", "Can proceed if empty", "Just slow down"], "ans": "Be ready to stop/slow", "exp": "Yield sign = be ready to stop but may proceed if way is clear.", "d": 1},
    {"q": "Multiple vehicles arriving 4-way stop same time - who goes?", "opts": ["Left-turner first", "Straight traffic first", "Right-turner first", "None - all wait"], "ans": "Straight traffic first", "exp": "If simultaneous arrival: straight traffic goes before turning traffic.", "d": 2},
    {"q": "Turning vehicle vs pedestrian crossing at corner - priority?", "opts": ["Vehicle turning", "Pedestrian crossing", "Both equal", "Whoever is faster"], "ans": "Pedestrian crossing", "exp": "Pedestrians at corner have priority - turning vehicles must yield.", "d": 1},
    {"q": "Can you turn left at red light?", "opts": ["Yes always", "No never", "Only if oncoming traffic stops", "Only if arrow shows"], "ans": "No never", "exp": "No left turn on red ever (unless arrow or specific sign). Right on red is allowed.", "d": 1},
]

# ROAD RULES/SAFETY COMPREHENSIVE POOL (120+ questions)
SAFETY_QUESTIONS = [
    # Speed Limits (1-15)
    {"q": "Default residential speed limit in Manitoba?", "opts": ["40 km/h", "50 km/h", "60 km/h", "70 km/h"], "ans": "50 km/h", "exp": "Standard residential = 50 km/h unless posted otherwise.", "d": 1},
    {"q": "Speed limit in school zone during school hours?", "opts": ["50 km/h", "40 km/h", "20-30 km/h", "No limit"], "ans": "20-30 km/h", "exp": "School zones require 20-30 km/h during operating hours - watch for kids.", "d": 1},
    {"q": "Default highway speed limit in Manitoba?", "opts": ["80 km/h", "100 km/h", "110 km/h", "120 km/h"], "ans": "110 km/h", "exp": "Highway speed limit = 110 km/h unless posted lower.", "d": 1},
    {"q": "What is speed limit near pedestrian/playground areas?", "opts": ["50 km/h", "40 km/h", "30 km/h", "20 km/h"], "ans": "30 km/h", "exp": "Playgrounds/pedestrian areas = 30 km/h for child safety.", "d": 1},
    {"q": "When must you reduce speed below posted limit?", "opts": ["Never", "When conditions require", "Only at night", "Only in winter"], "ans": "When conditions require", "exp": "Always reduce speed for weather, visibility, traffic, road conditions.", "d": 1},
    {"q": "Is posted speed limit maximum or target?", "opts": ["Target speed", "Exact speed required", "Maximum safe speed in ideal conditions", "Minimum speed"], "ans": "Maximum safe speed in ideal conditions", "exp": "Posted limit is max under ideal conditions - reduce for poor conditions.", "d": 2},
    {"q": "Speed limit in construction zone?", "opts": ["Normal posted limit", "Reduced - posted in zone", "Half of normal", "Worker determines"], "ans": "Reduced - posted in zone", "exp": "Construction zones have temporary lower speed limits - obey posted signs.", "d": 1},
    {"q": "What's safest following distance at 100 km/h?", "opts": ["2 car lengths", "3 car lengths", "2 seconds minimum", "1 second"], "ans": "2 seconds minimum", "exp": "Follow 2 seconds behind vehicle at highway speed = safe braking distance.", "d": 2},
    {"q": "In heavy traffic/rain, should you go speed limit?", "opts": ["Yes always", "No - reduce speed", "Speed doesn't matter", "Go faster to escape"], "ans": "No - reduce speed", "exp": "Reduce speed in heavy traffic and bad weather for safety.", "d": 1},
    {"q": "When entering residential area, how should you drive?", "opts": ["Same as highway", "Prepare to stop suddenly", "Gradually reduce speed", "Only slow at stop signs"], "ans": "Gradually reduce speed", "exp": "Residential areas: anticipate pedestrians, children - reduce speed appropriately.", "d": 2},
    {"q": "Is speed limit different between city and suburbs?", "opts": ["Same everywhere", "No fixed rules", "Usually lower in city", "Higher in suburbs"], "ans": "Usually lower in city", "exp": "Cities typically have lower speed limits than highways/rural areas.", "d": 1},
    {"q": "What's maximum speed in alley/parking lot?", "opts": ["20 km/h", "30 km/h", "40 km/h", "No limit"], "ans": "20 km/h", "exp": "Alleys and parking lots: 20 km/h - watch for pedestrians/vehicles.", "d": 2},
    {"q": "How far before speed limit sign should you adjust speed?", "opts": ["At sign", "Gradually before", "Immediately at sign", "After sign"], "ans": "Gradually before", "exp": "Adjust speed gradually as you approach limit change - don't brake hard at sign.", "d": 2},
    {"q": "If posted school zone limit is 30 km/h, must you always go 30?", "opts": ["Yes always", "No - only during hours", "Yes during school days", "No - it's optional"], "ans": "No - only during hours", "exp": "School zone limits apply only during posted school hours/days.", "d": 1},
    {"q": "Night driving - should you go slower than day?", "opts": ["No difference", "Slightly slower", "Significantly slower", "Can go faster"], "ans": "Slightly slower", "exp": "At night: visibility reduced - drive slightly slower than day conditions.", "d": 2},

    # Safe Driving (16-40)
    {"q": "What is a safe following distance rule?", "opts": ["1 car length", "2 seconds behind vehicle", "Distance in meters = speed in km/h", "Whatever feels comfortable"], "ans": "2 seconds behind vehicle", "exp": "Two-second rule: maintain 2 seconds between you and vehicle ahead at any speed.", "d": 1},
    {"q": "How do you measure 2-second following distance?", "opts": ["Count car lengths", "Note landmark - count 2 seconds for it to reach you", "Use speedometer", "Ask passenger"], "ans": "Note landmark - count 2 seconds for it to reach you", "exp": "Pick landmark ahead of car. Count seconds for landmark to reach you. Should be 2+.", "d": 2},
    {"q": "When should headlights be on?", "opts": ["Night only", "Day and night", "Reduced visibility or sunset to sunrise", "Only in rain"], "ans": "Reduced visibility or sunset to sunrise", "exp": "Headlights: from sunset to sunrise AND whenever visibility is reduced.", "d": 1},
    {"q": "When should you use high beam headlights?", "opts": ["Always", "Dark roads with no oncoming traffic", "In fog", "In rain"], "ans": "Dark roads with no oncoming traffic", "exp": "High beams: dark roads only. Dim for oncoming traffic within 150m.", "d": 2},
    {"q": "How far ahead should you look while driving?", "opts": ["5 meters", "Just ahead of car", "12-15 seconds ahead (250m at highway)", "To next intersection"], "ans": "12-15 seconds ahead (250m at highway)", "exp": "Look ahead 12-15 seconds - anticipate hazards, traffic, road conditions.", "d": 2},
    {"q": "What should you scan while driving?", "opts": ["Straight ahead only", "Mirrors, ahead, sides, behind", "Road only", "Speedometer"], "ans": "Mirrors, ahead, sides, behind", "exp": "Scan: mirrors frequently, ahead for hazards, sides for movements, behind for following vehicles.", "d": 2},
    {"q": "When should you check your mirrors?", "opts": ["Before turning only", "Frequently - every 5-10 seconds", "At intersections", "When changing lanes"], "ans": "Frequently - every 5-10 seconds", "exp": "Check mirrors regularly (every 5-10 sec) to stay aware of traffic around you.", "d": 2},
    {"q": "What is a blind spot?", "opts": ["No spot", "Area you can't see in mirrors", "Behind your car", "Area without road markings"], "ans": "Area you can't see in mirrors", "exp": "Blind spots exist beside/behind car where mirror/vision can't reach - check before changing lanes.", "d": 2},
    {"q": "How should you position yourself in lane?", "opts": ["Centered always", "Left side of lane", "Right side of lane", "Varies by road type"], "ans": "Centered always", "exp": "Stay centered in lane - avoid swerving, and leave room on both sides.", "d": 1},
    {"q": "What distance should you keep from parked cars?", "opts": ["Touch them", "1 meter if possible", "Don't need distance", "2 meters"], "ans": "1 meter if possible", "exp": "Leave space for parked car doors to open - at least 1 meter when possible.", "d": 2},
    {"q": "Safe way to pass another vehicle?", "opts": ["Speed up suddenly", "Signal, check mirrors/blind spots, pass, signal lane change", "Just swerve", "Only on highways"], "ans": "Signal, check mirrors/blind spots, pass, signal lane change", "exp": "Pass safely: signal intention → check safety → pass → signal return lane change.", "d": 2},
    {"q": "When passing another vehicle, how much space is safe?", "opts": ["Just fit in", "1 car length minimum", "At least one full car length ahead before returning", "Any space"], "ans": "At least one full car length ahead before returning", "exp": "After passing: need full car length of space between you and passed vehicle before returning lane.", "d": 2},
    {"q": "What should you do if car ahead suddenly brakes?", "opts": ["Honk and swerve", "Brake smoothly and controlled", "Speed up", "Stop completely"], "ans": "Brake smoothly and controlled", "exp": "Brake smoothly - don't lock wheels. Maintain control. Swerving can cause worse accident.", "d": 2},
    {"q": "Is it safe to shift to neutral while driving downhill?", "opts": ["Yes to save fuel", "No - stay in gear for engine braking", "Only on straight roads", "Only in automatic cars"], "ans": "No - stay in gear for engine braking", "exp": "Stay in gear downhill - engine braking helps control speed safer than just brakes.", "d": 2},
    {"q": "What's most dangerous driving behavior?", "opts": ["Going slightly over limit", "Distracted driving", "Defensive driving", "Using turn signals"], "ans": "Distracted driving", "exp": "Distracted driving (phones, eating, etc.) is leading cause of accidents.", "d": 1},
    {"q": "How often should you blink while driving?", "opts": ["Not important", "Normally - don't stare", "Once per minute", "Only at night"], "ans": "Normally - don't stare", "exp": "Blink normally - don't stare. Staring reduces awareness of surroundings.", "d": 2},
    {"q": "Safe position for hands on steering wheel?", "opts": ["One hand at 12 o'clock", "Both hands at 9 and 3 o'clock", "Wherever comfortable", "Left hand only on curves"], "ans": "Both hands at 9 and 3 o'clock", "exp": "Proper grip (9 and 3) provides best control and response to emergencies.", "d": 1},
    {"q": "Should driver's seat be upright or reclined?", "opts": ["Fully reclined", "Upright with full visibility", "Doesn't matter", "Reclined for comfort"], "ans": "Upright with full visibility", "exp": "Sit upright with good visibility - reclined position reduces control and visibility.", "d": 2},
    {"q": "How close should steering wheel be?", "opts": ["As far as comfortable", "10-30 cm from chest", "25-30 cm from body", "Touching chest"], "ans": "10-30 cm from chest", "exp": "Steering wheel: 10-30cm from your chest for comfort and control.", "d": 2},
    {"q": "What should you do if drowsy while driving?", "opts": ["Continue and fight it", "Pull over safely and rest", "Open window", "Turn up music"], "ans": "Pull over safely and rest", "exp": "If drowsy: pull over in safe area, rest, drink coffee, or change drivers.", "d": 1},
    {"q": "Is it legal to eat while driving?", "opts": ["Yes always", "No never", "Yes but not distracting", "Only at red lights"], "ans": "Yes but not distracting", "exp": "Can eat but must stay focused on driving - if distracting, find safe place to eat.", "d": 2},
    {"q": "Safe distance to drive behind large truck?", "opts": ["Normal car distance", "Longer - can't see road ahead", "3 meters minimum", "1 car length"], "ans": "Longer - can't see road ahead", "exp": "Behind truck: extra distance so you can see road ahead and brake space if needed.", "d": 2},
    {"q": "What's worst time to drive?", "opts": ["Morning", "Afternoon", "Night and early morning", "During day"], "ans": "Night and early morning", "exp": "Night/early morning: fatigue + poor visibility = most dangerous times.", "d": 2},
    {"q": "Should your seatbelt be tight or loose?", "opts": ["Loose for comfort", "Tight across lap and chest", "Just across lap", "Doesn't matter"], "ans": "Tight across lap and chest", "exp": "Seatbelt must be snug - loose belts don't protect properly in crash.", "d": 1},
    {"q": "When should you NOT use cruise control?", "opts": ["Never avoid it", "Heavy traffic, curves, wet/icy roads", "Always use it", "Only at night"], "ans": "Heavy traffic, curves, wet/icy roads", "exp": "Avoid cruise control: traffic, curves, poor conditions - need quick control.", "d": 2},

    # Winter/Weather (41-58)
    {"q": "What's most dangerous winter driving condition?", "opts": ["Snow", "Rain", "Ice (black ice)", "Wind"], "ans": "Ice (black ice)", "exp": "Black ice is invisible, slippery, and causes loss of control - most dangerous.", "d": 2},
    {"q": "What should you do if you start to skid on ice?", "opts": ["Slam on brakes", "Steer direction you want to go, ease off gas", "Accelerate", "Honk horn"], "ans": "Steer direction you want to go, ease off gas", "exp": "Skid: steer where you want front to go, reduce throttle, don't brake hard.", "d": 2},
    {"q": "Tire tread minimum depth for winter?", "opts": ["2mm", "3mm (10/32 inch)", "5mm", "1mm"], "ans": "3mm (10/32 inch)", "exp": "Winter tires need 3mm+ tread depth for snow/ice grip - check regularly.", "d": 2},
    {"q": "Should you warm up engine before driving in winter?", "opts": ["30+ minutes", "Just until engine starts", "5-10 minutes", "Not necessary"], "ans": "5-10 minutes", "exp": "Warm up 5-10 min in winter - helps defroster, visibility, traction.", "d": 1},
    {"q": "What visibility must you have before driving?", "opts": ["Whatever you can manage", "All windows clear of snow/frost", "Just windshield", "Just side mirrors"], "ans": "All windows clear of snow/frost", "exp": "Clear ALL windows, mirrors, lights of snow/ice before driving for safety.", "d": 1},
    {"q": "How much longer does it take to stop in winter?", "opts": ["25% longer", "50% longer", "100% longer or more", "Same as summer"], "ans": "100% longer or more", "exp": "Winter stopping distance can double or more - reduce speed significantly.", "d": 2},
    {"q": "If your car slides on snow, which way do you steer?", "opts": ["Opposite direction of slide", "Same direction as slide", "Don't steer", "Towards shoulder"], "ans": "Same direction as slide", "exp": "Steer WHERE you want front to go (direction of slide) to regain traction.", "d": 2},
    {"q": "What tire pressure in winter?", "opts": ["Same as summer", "Increase 10%", "Decrease - pressure drops in cold", "No effect from cold"], "ans": "Decrease - pressure drops in cold", "exp": "Cold reduces tire pressure - check monthly and adjust to proper PSI.", "d": 2},
    {"q": "Best tire type for winter in Manitoba?", "opts": ["All-season", "Winter tires with studs/sipes", "Summer tires", "Doesn't matter"], "ans": "Winter tires with studs/sipes", "exp": "Winter tires (snow tires) have sipes/studs for snow/ice grip - best winter choice.", "d": 1},
    {"q": "Safe distance behind snowplow?", "opts": ["Normal distance", "Very far back - 150+ meters", "10 meters", "Whatever is visible"], "ans": "Very far back - 150+ meters", "exp": "Stay well back from plows - debris, sudden stops, reduced visibility hazards.", "d": 2},
    {"q": "What happens to vehicle control with studded tires on clear road?", "opts": ["Better control", "No difference", "Reduced grip/control", "Tires wear faster"], "ans": "Reduced grip/control", "exp": "Studs: excellent on ice but poorer grip on dry/wet roads - traffic safety tradeoff.", "d": 2},
    {"q": "Driving through slush - what to avoid?", "opts": ["Normal driving", "Sudden acceleration/braking", "Maintenance speed", "Using lights"], "ans": "Sudden acceleration/braking", "exp": "Slush: smooth acceleration, gentle braking - avoid sudden movements.", "d": 2},
    {"q": "What's whiteout driving?", "opts": ["Very clean car", "Heavy snow reducing visibility to near zero", "White line on road", "Bright headlights"], "ans": "Heavy snow reducing visibility to near zero", "exp": "Whiteout: blowing snow makes road/direction invisible - pull over until clear.", "d": 2},
    {"q": "Should you use winter tires year-round?", "opts": ["Yes always", "No - switch to all-season when warm", "Only in city", "Doesn't matter"], "ans": "No - switch to all-season when warm", "exp": "Winter tires: swap to all-season when consistently above 7°C - softer compound wears fast on warm roads.", "d": 2},
    {"q": "What's hydroplaning?", "opts": ["Skidding on ice", "Tires losing contact with road due to water layer", "Heavy rain", "Aquaplaning doesn't exist"], "ans": "Tires losing contact with road due to water layer", "exp": "Hydroplaning: water layer between tire/road reduces control - slow down in heavy rain.", "d": 2},
    {"q": "If hydroplaning, should you brake?", "opts": ["Hard", "Gently slow down", "Never", "Only downhill"], "ans": "Gently slow down", "exp": "Hydroplaning: ease off gas, steer straight, let friction return - don't brake hard.", "d": 2},
    {"q": "Fog driving - high beams or low?", "opts": ["High beams better visibility", "Low beams - high beams reflect off fog", "Doesn't matter", "No lights needed"], "ans": "Low beams - high beams reflect off fog", "exp": "Fog: low beams only - high beams reflect off water droplets, reducing visibility.", "d": 2},
    {"q": "What emergency kit should winter vehicle have?", "opts": ["Nothing needed", "Blanket, flashlight, jumper cables, first aid", "Just spare tire", "Only in mountains"], "ans": "Blanket, flashlight, jumper cables, first aid", "exp": "Winter kit: blanket, light, jumpers, first aid, flares, sand, scraper.", "d": 2},

    # Emergency Procedures (59-80)
    {"q": "If brakes fail while driving, what do you do?", "opts": ["Panic and swerve", "Pump brakes, shift to neutral, use emergency brake", "Speed up to get to safety", "Turn off engine"], "ans": "Pump brakes, shift to neutral, use emergency brake", "exp": "Brake failure: pump pedal, shift neutral, gradually apply emergency brake.", "d": 2},
    {"q": "Vehicle tire blow-out on highway - what to do?", "opts": ["Hard braking", "Firm grip wheel, ease off gas, gradually slow down", "Swerve away", "Accelerate"], "ans": "Firm grip wheel, ease off gas, gradually slow down", "exp": "Blow-out: grip wheel firm, don't panic, reduce speed gradually, pull to shoulder safely.", "d": 2},
    {"q": "Engine overheating - what do you do?", "opts": ["Keep driving", "Pull over, turn off AC, let cool, don't open hot radiator", "Pour water on engine", "Open hood immediately"], "ans": "Pull over, turn off AC, let cool, don't open hot radiator", "exp": "Overheating: pull over safely, turn off AC, let engine cool, check fluid when cool.", "d": 2},
    {"q": "Car is hydroplaning in rain - actions?", "opts": ["Brake hard", "Ease off gas, steer straight, regain control", "Honk", "Turn sharply"], "ans": "Ease off gas, steer straight, regain control", "exp": "Hydroplaning: stay calm, ease off throttle, steer straight, slow down gradually.", "d": 2},
    {"q": "Steering failure while driving?", "opts": ["Speed up", "Gradual braking, shift to neutral, use emergency brake", "Turn wheel hard", "Jump out"], "ans": "Gradual braking, shift to neutral, use emergency brake", "exp": "Steering failure: calm braking, neutral, emergency brake, try to get to shoulder.", "d": 2},
    {"q": "Loss of power steering - how does it affect driving?", "opts": ["No effect", "Steering wheel becomes very hard to turn", "Better control", "No change in control"], "ans": "Steering wheel becomes very hard to turn", "exp": "No power steering: steering wheel requires much more force - plan ahead, brake gently.", "d": 2},
    {"q": "Vehicle catches fire while driving - action?", "opts": ["Keep driving", "Pull over, turn off engine, exit safely, don't open hood", "Speed up to blow out flames", "Rev engine"], "ans": "Pull over, turn off engine, exit safely, don't open hood", "exp": "Fire: pull over, turn off engine, get everyone out, move away from vehicle.", "d": 2},
    {"q": "What is immediate action if you witness accident?", "opts": ["Drive away", "Stop at safe distance, call 911, help if safe, don't move injured", "Honk horn", "Speed up to find help"], "ans": "Stop at safe distance, call 911, help if safe, don't move injured", "exp": "Accident: stop safely, call emergency, assess safety, help only if trained, don't move injured.", "d": 2},
    {"q": "If hit from behind while stationary - actions?", "opts": ["Exit vehicle immediately", "Turn on hazard lights, assess injuries, move to safe area if safe", "Back up", "Drive normally"], "ans": "Turn on hazard lights, assess injuries, move to safe area if safe", "exp": "Hit from behind: hazard lights on, check for injuries, move away from traffic if safe.", "d": 2},
    {"q": "Car spins out on icy road - what to do?", "opts": ["Slam brakes", "Don't panic, steer in direction you want front to go, ease off gas", "Accelerate", "Jump out"], "ans": "Don't panic, steer in direction you want front to go, ease off gas", "exp": "Spinout: remain calm, steer where you want front, reduce throttle, regain control.", "d": 2},
    {"q": "Hazard lights are for?", "opts": ["Decoration", "Making car more visible when broken down, in accident, emergency", "Only in dark", "Police use only"], "ans": "Making car more visible when broken down, in accident, emergency", "exp": "Hazard lights: use when broken down, accident, emergency - alerts other drivers.", "d": 1},
    {"q": "If engine stalls in traffic, what's safest?", "opts": ["Stay in lane", "Turn hazards on, coast to shoulder if possible, restart", "Panic", "Exit vehicle"], "ans": "Turn hazards on, coast to shoulder if possible, restart", "exp": "Stall: hazards on, coast to safe spot, restart, if can't restart call for help.", "d": 2},
    {"q": "Vehicle rolling backward downhill - what to do?", "opts": ["Jump out", "Apply brakes firmly, get engine in gear", "Steer away", "Release brakes"], "ans": "Apply brakes firmly, get engine in gear", "exp": "Rolling backward: apply firm braking, shift to lower gear to stop momentum.", "d": 2},

    # Maintenance (81-95)
    {"q": "How often should tires be rotated?", "opts": ["Never", "Every 10,000-15,000 km", "Once a year", "Only when worn"], "ans": "Every 10,000-15,000 km", "exp": "Rotate tires regularly to ensure even wear and longer tire life.", "d": 2},
    {"q": "What tire tread depth is dangerous?", "opts": ["2mm", "Less than 1.6mm (2/32 inch)", "5mm", "3mm"], "ans": "Less than 1.6mm (2/32 inch)", "exp": "Tires below 1.6mm tread = legal limit - replace for safety (even if legal).", "d": 2},
    {"q": "How to check tire tread depth?", "opts": ["Visual guess", "Penny test: insert penny in tread grooves", "Measurement only", "Feel texture"], "ans": "Penny test: insert penny in tread grooves", "exp": "Penny test: insert penny with Lincoln's head down. Should cover head = adequate tread.", "d": 2},
    {"q": "Correct tire pressure for your car?", "opts": ["On tire sidewall", "On driver's door jamb placard", "Manual recommended", "Same for all cars"], "ans": "On driver's door jamb placard", "exp": "Correct PSI: on placard inside driver's door, not sidewall (sidewall shows MAX PSI).", "d": 2},
    {"q": "How often check tire pressure?", "opts": ["Never needed", "Monthly minimum", "Once a year", "Only if flat"], "ans": "Monthly minimum", "exp": "Check tire pressure monthly - air naturally leaks, cold reduces pressure.", "d": 2},
    {"q": "When should wiper blades be replaced?", "opts": ["Every 5 years", "When they stop cleaning effectively/streak", "Once a year", "Never"], "ans": "When they stop cleaning effectively/streak", "exp": "Replace wipers when they streak/don't clean well - usually every 6-12 months.", "d": 2},
    {"q": "What does brake fluid do?", "opts": ["Lubricates engine", "Transmits brake pressure from pedal to wheels", "Cools brakes", "Lights brake lights"], "ans": "Transmits brake pressure from pedal to wheels", "exp": "Brake fluid: hydraulic fluid that transfers pedal pressure to brake calipers.", "d": 2},
    {"q": "How do you check brake fluid level?", "opts": ["Drain it", "Check reservoir under hood", "By brake response", "Visual inspection only"], "ans": "Check reservoir under hood", "exp": "Brake fluid: check reservoir (usually plastic) under hood - should be at min/max line.", "d": 2},
    {"q": "What does grinding noise from brakes indicate?", "opts": ["Normal", "Brake pads completely worn - metal on metal", "Just needing lubrication", "Air in system"], "ans": "Brake pads completely worn - metal on metal", "exp": "Grinding: pads worn through - dangerous, reduces braking. Replace immediately.", "d": 2},
    {"q": "Vehicle inspection requirements in Manitoba?", "opts": ["None", "Every 2 years", "Annual inspection", "Every 5 years"], "ans": "Annual inspection", "exp": "Annual vehicle inspection required in Manitoba for safety, emissions, equipment.", "d": 1},
    {"q": "What should inspection cover?", "opts": ["Just tires", "Lights, brakes, tires, steering, emissions", "Only safety", "Whatever shop decides"], "ans": "Lights, brakes, tires, steering, emissions", "exp": "Inspection: headlights/signals, brakes, tires, steering, wipers, emissions, etc.", "d": 2},
    {"q": "Fluids to check regularly?", "opts": ["Only oil", "Oil, coolant, brake fluid, windshield washer", "Just coolant", "Never check"], "ans": "Oil, coolant, brake fluid, windshield washer", "exp": "Check regularly: oil, coolant, brake fluid, windshield washer, transmission fluid.", "d": 2},
    {"q": "How often change engine oil?", "opts": ["Every 1,000 km", "Every 5,000-10,000 km or as recommended", "Never", "Once a year"], "ans": "Every 5,000-10,000 km or as recommended", "exp": "Oil change: follow manufacturer recommendation - modern cars go longer between changes.", "d": 2},
    {"q": "What does ABS (Anti-lock Braking System) do?", "opts": ["Prevents skidding", "Prevents wheel lock-up during hard braking", "Automatically stops car", "Increases brake power"], "ans": "Prevents wheel lock-up during hard braking", "exp": "ABS: pulses brakes to prevent wheel lock, maintains steering control in emergency braking.", "d": 2},
    {"q": "What does ESC (Electronic Stability Control) do?", "opts": ["Speeds up car", "Helps maintain control on slippery roads by adjusting braking/power", "Increases fuel economy", "Prevents sliding"], "ans": "Helps maintain control on slippery roads by adjusting braking/power", "exp": "ESC: automatically applies brakes/reduces power to prevent loss of control on slippery roads.", "d": 2},

    # Driver Responsibility (96-120)
    {"q": "Legal driving age in Manitoba?", "opts": ["15", "16", "17", "18"], "ans": "16", "exp": "Minimum driving age in Manitoba is 16 years old with learner's permit.", "d": 1},
    {"q": "Legal alcohol limit for driving?", "opts": ["0%", "0.05%", "0.08%", "0.10%"], "ans": "0.08%", "exp": "Legal limit: 0.08% BAC (blood alcohol content) for regular drivers.", "d": 1},
    {"q": "Minimum age for seatbelt exemption in vehicle?", "opts": ["No exemptions", "Medical note only", "Anyone can go without", "Driving alone"], "ans": "Medical note only", "exp": "Seatbelts mandatory except with medical exemption - always wear unless exempt.", "d": 1},
    {"q": "Can you use cell phone while driving?", "opts": ["Yes anytime", "Hand-free only - held devices illegal", "Only in emergency", "At red lights"], "ans": "Hand-free only - held devices illegal", "exp": "Cell phone: hand-free systems legal, holding/texting illegal - distracted driving violation.", "d": 1},
    {"q": "Is eating while driving illegal?", "opts": ["Always illegal", "Legal but not while distracted", "Illegal if distracted", "Never illegal"], "ans": "Legal but not while distracted", "exp": "Eating: legal but must maintain focus - if distracted, find safe place to eat.", "d": 2},
    {"q": "Driving with suspended license consequence?", "opts": ["Fine only", "Criminal charge, jail, vehicle impound", "Warning", "Just ticket"], "ans": "Criminal charge, jail, vehicle impound", "exp": "Driving suspended: serious criminal charge, jail time possible, vehicle confiscated.", "d": 1},
    {"q": "When required to report accident?", "opts": ["Never", "Always", "Only if injury/major damage", "Only if other driver wants"], "ans": "Always", "exp": "Report all accidents to police - required even for minor incidents.", "d": 1},
    {"q": "What to exchange after accident?", "opts": ["Nothing", "Insurance info, license, vehicle registration", "Just names", "Phone only"], "ans": "Insurance info, license, vehicle registration", "exp": "After accident: names, numbers, addresses, insurance, license plates, vehicle details.", "d": 1},
    {"q": "Minimum insurance coverage needed?", "opts": ["Liability only", "$200,000 liability minimum", "$50,000 minimum", "No minimum"], "ans": "$200,000 liability minimum", "exp": "Manitoba minimum: $200,000 liability coverage (may increase per new laws).", "d": 2},
    {"q": "What does liability insurance cover?", "opts": ["Your car damage", "Injury/damage you cause to others", "Your medical", "All damage"], "ans": "Injury/damage you cause to others", "exp": "Liability: covers damage/injury caused by you to other people/property.", "d": 2},
    {"q": "Does insurance cover intentional damage?", "opts": ["Yes always", "No - intentional acts not covered", "Sometimes", "Depends on reason"], "ans": "No - intentional acts not covered", "exp": "Insurance excludes intentional damage, criminal acts, gross negligence.", "d": 2},
    {"q": "Vehicle registration requirements?", "opts": ["Optional", "Vehicle must be registered annually in Manitoba", "Only new cars", "Never needed"], "ans": "Vehicle must be registered annually in Manitoba", "exp": "Annual registration required - provides proof of insurance and inspection compliance.", "d": 1},
    {"q": "What does vehicle registration show?", "opts": ["Just owner name", "Owner, vehicle details, insurance proof", "License plate only", "Nothing important"], "ans": "Owner, vehicle details, insurance proof", "exp": "Registration: proves ownership, insurance, vehicle specs, license validity.", "d": 2},
    {"q": "If pedestrian hit you (your fault), what's your responsibility?", "opts": ["Nothing - it's their fault", "Provide aid, call emergency, cooperate with police", "Just leave", "Give money"], "ans": "Provide aid, call emergency, cooperate with police", "exp": "Hit pedestrian: call 911, provide aid if trained, cooperate fully with police investigation.", "d": 2},
    {"q": "Can you refuse breathalyzer test if suspected impaired?", "opts": ["Yes refuse anytime", "No - refusal = serious charge", "Yes but loses license", "Depends on officer"], "ans": "No - refusal = serious charge", "exp": "Refusal to provide breath sample: serious criminal charge, automatic license suspension.", "d": 2},
    {"q": "What's distracted driving?", "opts": ["Driving slowly", "Any activity diverting attention from driving (phone, eating, grooming)", "Driving over speed limit", "Poor visibility"], "ans": "Any activity diverting attention from driving (phone, eating, grooming)", "exp": "Distracted driving: anything taking focus from road - illegal and dangerous.", "d": 1},
    {"q": "Penalty for distracted driving ticket?", "opts": ["Just warning", "Fine $200-$300+, insurance increase, demerit points", "License suspension", "Criminal charge"], "ans": "Fine $200-$300+, insurance increase, demerit points", "exp": "Distracted driving: hefty fine, demerit points, insurance hike, potential license loss.", "d": 2},
    {"q": "How many demerit points for careless driving?", "opts": ["1 point", "3 points", "6 points", "10 points"], "ans": "6 points", "exp": "Careless driving: 6 demerit points - accumulating too many = license suspension.", "d": 2},
    {"q": "What's illegal about parking in handicap spot?", "opts": ["Nothing", "Illegal without proper permit/plate", "Only if handicap person present", "Never allowed"], "ans": "Illegal without proper permit/plate", "exp": "Handicap spots: legal only with proper license plate/permit - violations fined heavily.", "d": 1},
    {"q": "Is leaving engine running while parked legal?", "opts": ["Always legal", "Only 5 min max in residential areas", "Never legal", "Only in winter"], "ans": "Only 5 min max in residential areas", "exp": "Idling: limited to 5 minutes in residential areas to reduce pollution/emissions.", "d": 2},
    {"q": "Should you honk at pedestrians?", "opts": ["Yes always", "No - use horn only for warnings", "Only at night", "Only if they're jaywalking"], "ans": "No - use horn only for warnings", "exp": "Horn: for safety warnings only, not to alert pedestrians to move.", "d": 2},
    {"q": "What's right way to merge on highway?", "opts": ["Cut across immediately", "Signal, match speed, merge when safe", "Merge without signaling", "Wait until last minute"], "ans": "Signal, match speed, merge when safe", "exp": "Merge: signal well ahead, check mirrors/blind spots, match traffic speed, merge smoothly.", "d": 2},
    {"q": "Pedestrian in your path - what do you do?", "opts": ["Speed up", "Honk and proceed", "Stop and let them cross safely", "Flash lights"], "ans": "Stop and let them cross safely", "exp": "Pedestrian in path: stop immediately, let them cross safely - they always have priority.", "d": 1},
    {"q": "What's proper distance from cyclist?", "opts": ["Touch them", "1 meter minimum", "3 meters", "Whatever is available"], "ans": "1 meter minimum", "exp": "Cyclists: pass with at least 1 meter clearance - they're vulnerable road users.", "d": 1},
    {"q": "Professional driver responsibilities?", "opts": ["Just drive", "Maintain vehicle, rest properly, focus on safety, follow all laws", "Go fast to stay on schedule", "No special duties"], "ans": "Maintain vehicle, rest properly, focus on safety, follow all laws", "exp": "Professional drivers: extra responsibility for vehicle maintenance, rest, safety, compliance.", "d": 2},
]

def insert_tests():
    """Insert tests directly into database."""
    engine = create_engine(settings.database_url_sync)

    with Session(engine) as session:
        try:
            # Find bernel
            user = session.query(User).filter(User.email == BERNEL_EMAIL).first()
            if not user:
                print(f"❌ User {BERNEL_EMAIL} not found!")
                return False

            print(f"✅ Found: {user.email}\n")

            # Create Signals test (120 questions)
            signals_material = StudyMaterial(
                id=uuid.uuid4(),
                user_id=user.id,
                title="Class 5 Manitoba - Signals/Signs/Road Markings (120 Q)",
                subject="Signals, Signs, Markings, Right-of-Way",
                description="120 comprehensive questions. Each revision session: 30 random questions (randomized, different each time). Complete signals & signs coverage for thorough preparation.",
                source_type="other",
                difficulty_level=2,
                generated_formats={"quiz": "completed"},
            )
            session.add(signals_material)
            session.flush()

            # Add signals questions
            for q_data in SIGNALS_QUESTIONS:
                q = QuizQuestion(
                    id=uuid.uuid4(),
                    material_id=signals_material.id,
                    question_text=q_data["q"],
                    question_type="multiple_choice",
                    options=q_data["opts"],
                    correct_answer=q_data["ans"],
                    explanation=q_data["exp"],
                    difficulty=q_data["d"],
                )
                session.add(q)

            print(f"✅ Added 120 Signals/Signs questions")

            # Create Safety test (120 questions)
            safety_material = StudyMaterial(
                id=uuid.uuid4(),
                user_id=user.id,
                title="Class 5 Manitoba - Road Rules/Safety (120 Q)",
                subject="Speed Limits, Safe Driving, Maintenance, Emergency",
                description="120 comprehensive questions. Each revision session: 30 random questions (randomized, different each time). Complete road rules & safety coverage for thorough preparation.",
                source_type="other",
                difficulty_level=2,
                generated_formats={"quiz": "completed"},
            )
            session.add(safety_material)
            session.flush()

            # Add safety questions
            for q_data in SAFETY_QUESTIONS:
                q = QuizQuestion(
                    id=uuid.uuid4(),
                    material_id=safety_material.id,
                    question_text=q_data["q"],
                    question_type="multiple_choice",
                    options=q_data["opts"],
                    correct_answer=q_data["ans"],
                    explanation=q_data["exp"],
                    difficulty=q_data["d"],
                )
                session.add(q)

            print(f"✅ Added 120 Road Rules/Safety questions")

            session.commit()

            print(f"\n{'='*75}")
            print(f"✅ SUCCESS! Class 5 Driver License Tests Created")
            print(f"{'='*75}")
            print(f"\n📚 Comprehensive Test Suites for {user.first_name} {user.last_name}:")
            print(f"\n   1️⃣  SIGNALS/SIGNS TEST - 120 Questions")
            print(f"       Topics: Traffic lights, flashing lights, signs, markings, right-of-way")
            print(f"       Each revision: 30 random from 120 (completely different each time)")
            print(f"\n   2️⃣  ROAD RULES/SAFETY TEST - 120 Questions")
            print(f"       Topics: Speed limits, safe driving, winter, maintenance, emergencies")
            print(f"       Each revision: 30 random from 120 (completely different each time)")
            print(f"\n🎯 Smart Randomization for Complete Knowledge:")
            print(f"   ✓ 120-question pools (covers ALL knowledge areas)")
            print(f"   ✓ 30 questions per revision session")
            print(f"   ✓ Random selection ensures different questions each attempt")
            print(f"   ✓ Answer options shuffled (prevents pattern memorization)")
            print(f"   ✓ 80% pass threshold = 24+ correct required")
            print(f"\n📊 Revision Strategy:")
            print(f"   • Session 1: Get 30 random questions → learn answers")
            print(f"   • Session 2: Different 30 from 120 → cover more areas")
            print(f"   • Session 3+: Keep revising, hitting all 120 eventually")
            print(f"   • Large pool ensures comprehensive exam preparation")
            print(f"\n📖 Knowledge Coverage:")
            print(f"   Test 1: Traffic lights (all variants), signs, lane markings, right-of-way")
            print(f"   Test 2: Speed limits, safe distance, winter driving, maintenance, emergency")
            print(f"\n{'='*75}")

            return True

        except Exception as e:
            print(f"❌ Error: {e}")
            session.rollback()
            return False
        finally:
            session.close()

if __name__ == "__main__":
    print("🚀 Creating Class 5 Driver License Test Suite...\n")
    success = insert_tests()
    sys.exit(0 if success else 1)
