"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  GraduationCap,
  Plane,
  Trophy,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { PSTAR_SECTIONS, getQuestionsBySection, PSTARQuestion } from "@/lib/pstar-data";

type Tab = "summary" | "flashcards" | "quiz";

const SECTION_SUMMARIES: Record<number, { heading: string; points: string[] }[]> = {
  1: [
    { heading: "Right-of-Way Order", points: ["Aircraft in distress has right of way over all others", "Priority order: balloon → glider → airship → powered aircraft", "Lower category always yields to higher category"] },
    { heading: "Converging & Head-On", points: ["Converging at the same altitude: give way to aircraft on your right", "Head-on: both pilots turn right", "Overtaking: pass to the right; the overtaken aircraft has right of way"] },
    { heading: "Final Approach", points: ["Aircraft on final approach has right of way over aircraft in flight", "Lower aircraft on approach has right of way over higher aircraft", "Never cut off another aircraft established on final"] },
  ],
  2: [
    { heading: "Light Signals — Aircraft in Air", points: ["Steady green: cleared to land", "Steady red: give way, continue circling", "Flashing green: cleared to approach", "Flashing red: aerodrome unsafe, do not land", "Flashing white: return to starting point on aerodrome", "Alternating red/green: exercise extreme caution"] },
    { heading: "Light Signals — Aircraft on Ground", points: ["Steady green: cleared for takeoff", "Steady red: stop", "Flashing green: cleared to taxi", "Flashing red: taxi clear of landing area", "Flashing white: return to starting point", "Alternating red/green: exercise extreme caution"] },
    { heading: "Distress Signals", points: ["Three red flares in succession = distress", "SOS in Morse code (··· --- ···)", "MAYDAY spoken three times on radio (121.5 MHz)"] },
  ],
  3: [
    { heading: "Urgency vs Distress", points: ["MAYDAY (×3): immediate grave danger — distress signal", "PAN-PAN (×3): urgent but not immediately dangerous — urgency signal", "Distress takes priority over all other communications", "121.5 MHz is the international emergency/distress frequency"] },
    { heading: "Transponder Codes", points: ["7700: Emergency", "7600: Radio communication failure", "7500: Unlawful interference (hijacking)", "1200: VFR flight in uncontrolled airspace (default)"] },
    { heading: "Phonetic Alphabet", points: ["Alpha Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike", "November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu", "Numbers spoken individually; multiples of hundreds/thousands said as a group"] },
    { heading: "Altimetry & ATIS", points: ["QNH: altimeter set to give altitude above sea level — most common setting", "QFE: altimeter reads height above aerodrome elevation", "QNE: altimeter set to standard 1013.25 hPa — used above transition altitude", "ATIS: Automatic Terminal Information Service — listen before calling ATC"] },
  ],
  4: [
    { heading: "Standard Traffic Circuit", points: ["Left-hand circuit is standard unless published otherwise", "Circuit altitude: 1000 ft AGL for fixed-wing (check local procedures)", "Join at 45° to the downwind leg at circuit altitude", "Land and take off into wind whenever practical"] },
    { heading: "Uncontrolled Aerodromes", points: ["Broadcast intentions on the CTAF/UNICOM frequency", "Listen before transmitting — other aircraft may already be in circuit", "Right-of-way rules still apply even without ATC"] },
    { heading: "Wind Indicators", points: ["Wind sock points away from wind direction — you fly toward it", "Wind sock fully extended (horizontal) = strong wind; sagging = light wind", "Tetrahedron: large end points into wind — land/take off in that direction"] },
  ],
  5: [
    { heading: "Required Equipment — Day VFR", points: ["Airspeed indicator", "Sensitive altimeter", "Magnetic compass", "Tachometer (if engine governor not installed)", "Oil pressure gauge (liquid-cooled or turbocharged engine)", "Oil temperature gauge (air-cooled engine with oil cooler)"] },
    { heading: "ELT (Emergency Locator Transmitter)", points: ["Required for most aircraft operating away from a controlled aerodrome", "Modern ELTs transmit on 406 MHz (satellite-linked) and 121.5 MHz", "Only test within the first 5 minutes of each hour and for no more than 5 seconds", "G-activated: deploys automatically on impact"] },
    { heading: "Overwater & Survival Equipment", points: ["Life jacket required for overwater flight in single-engine aircraft at night or > 50 nm from shore", "Life preservers must be accessible in flight — not just stowed in a bag", "Survival equipment requirements depend on terrain and distance from assistance"] },
  ],
  6: [
    { heading: "Pilot Permits & Licences", points: ["Student Pilot Permit (SPP): minimum 14 years, Category 4 medical, can solo under supervision", "Recreational Pilot Permit (RPP): minimum 16 years, Category 4 medical, 25 hours total", "Private Pilot Licence (PPL): minimum 17 years, Category 3 medical, 45 hours total flight time", "Commercial Pilot Licence (CPL): minimum 18 years, Category 1 medical"] },
    { heading: "Medical Requirements", points: ["Category 1: required for ATPL and airline operations", "Category 3: required for CPL, INRAT, PPL — must hold Cat 3 before solo cross-country", "Category 4: for SPP and RPP — basic self-declaration of health", "Colour vision tested at Category 3 and above"] },
    { heading: "Alcohol & Substances", points: ["8-hour 'bottle to throttle' rule is the minimum — longer is better", "Blood Alcohol Concentration (BAC) must not exceed 0.08%", "No drugs — legal or illegal — that impair performance", "Pilot must not fly if impaired by alcohol or any substance"] },
    { heading: "Passenger Currency", points: ["5 takeoffs and 5 landings in preceding 6 months to carry passengers", "5 night takeoffs and landings in preceding 6 months for night passenger flights", "Currency is separate from medical validity — check both before each flight"] },
  ],
  7: [
    { heading: "What Are Wake Vortices?", points: ["Rotating cylinders of air created at each wingtip as lift is generated", "Heaviest, slowest, cleanest aircraft (gear up, flaps up) generate the strongest vortices", "Vortices sink at 400–500 ft/min and spread outward from the aircraft track", "They can persist for 2+ minutes in calm conditions"] },
    { heading: "Avoidance on Takeoff", points: ["Rotate before the preceding heavy aircraft's rotation point", "Climb above and upwind of the preceding aircraft's flight path", "With calm wind, vortices remain near the rotation zone — wait 2+ minutes"] },
    { heading: "Avoidance on Landing", points: ["Land beyond the touchdown point of the preceding heavy aircraft", "Fly an approach above and upwind of the preceding aircraft's approach path", "A light tailwind can push vortices toward the threshold — extra caution required", "A light crosswind can keep one vortex on the runway — use the upwind side"] },
  ],
  8: [
    { heading: "Hypoxia", points: ["Oxygen deficiency affecting brain function", "Symptoms: euphoria, impaired judgment, blue lips/fingernails (cyanosis), unconsciousness", "Insidious onset — pilot may not notice incapacitation", "Treatment: supplemental oxygen or immediate descent"] },
    { heading: "Hyperventilation", points: ["Breathing too fast expels too much CO₂, lowering blood CO₂ levels", "Symptoms: tingling fingers, dizziness, muscle cramps, fainting", "Often triggered by anxiety; sometimes mistaken for hypoxia", "Treatment: consciously slow breathing; breathe into a paper bag"] },
    { heading: "Spatial Disorientation", points: ["The vestibular system (inner ear) can be fooled in IMC or at night", "'The leans': bank held too long creates false sense of wings-level", "Graveyard spiral: pilot senses wings level while in a steep descending turn", "Trust the flight instruments — do not fly by feel in IMC"] },
    { heading: "Other Aeromedical Hazards", points: ["Carbon monoxide: colourless, odourless; symptoms = headache, nausea; open windows, land immediately", "Middle ear: Valsalva manoeuvre (hold nose, exhale gently) to equalize pressure on descent", "Night vision: 30 minutes for full dark adaptation; use off-centre vision (look 10–15° off target)", "Fatigue: degrades decision-making and reaction time — go/no-go decision before flight"] },
  ],
  9: [
    { heading: "VFR Fuel Requirements (CARs 602.88)", points: ["Day VFR aeroplane: fuel to destination + 30 min reserve at normal cruise", "Night VFR aeroplane: fuel to destination + 45 min reserve at normal cruise", "Day VFR helicopter: fuel to destination + 20 min reserve at normal cruise", "Night VFR helicopter: fuel to destination + 30 min reserve at normal cruise"] },
    { heading: "Fuel Quality", points: ["Avgas 100LL (low lead) — blue dye — most piston aircraft", "Jet A-1 — turbine engines and modern diesel pistons", "Always verify fuel grade matches aircraft POH specification", "Drain fuel sumps before flight to check for water contamination"] },
    { heading: "Density Altitude Effects", points: ["High density altitude = thinner air = reduced engine and aerodynamic performance", "Increases with: higher temperature, higher pressure altitude, higher humidity", "On hot days at high-altitude airports: longer takeoff roll, reduced climb rate", "Always calculate density altitude and compare with POH performance charts"] },
  ],
  10: [
    { heading: "True vs Magnetic vs Compass", points: ["True North: geographic (map) north pole", "Magnetic North: where compass points — shifts westward over time", "Magnetic variation: difference between true and magnetic north (east or west)", "Compass deviation: aircraft-specific error caused by metal and electronics — posted on cockpit deviation card"] },
    { heading: "Heading Conversion", points: ["True → Magnetic: subtract east variation, add west variation (TVMDC: 'True Virgins Make Dull Company')", "Magnetic → Compass: apply deviation correction from the deviation card", "Example: True 090°, variation 15°W → Magnetic 105°, deviation -2° → Compass 107°"] },
    { heading: "Time, Speed, Distance", points: ["Distance = Speed × Time (D = S × T)", "Groundspeed = True Airspeed ± wind component", "1-in-60 rule: 1° of track error = 1 nm off course per 60 nm flown", "Wind correction angle (WCA) calculated from TAS, track, and wind vector"] },
  ],
  11: [
    { heading: "Standard Atmosphere", points: ["Sea level: 15°C, 1013.25 hPa, density 1.225 kg/m³", "Standard temperature lapse rate: 2°C per 1000 ft", "Pressure decreases approximately 1 hPa per 30 ft near sea level", "Above tropopause (~36,000 ft): temperature stays constant at −56.5°C"] },
    { heading: "Fog & Low Visibility", points: ["Dew point spread < 3°C with clear skies and light wind = fog likely", "Radiation fog: forms on calm clear nights over land; lifts by mid-morning", "Advection fog: warm moist air over cold surface; can persist in coastal areas", "Fog is defined as cloud at the surface with visibility < 1 sm (< 1 km in aviation reports)"] },
    { heading: "Fronts", points: ["Cold front: fast-moving, steep slope; severe turbulence, CBs, line squalls; clears quickly after passage", "Warm front: slow-moving, gradual slope; extensive stratus, drizzle, poor visibility, possible icing", "Occluded front: combination of cold and warm characteristics; complex weather", "Stationary front: warm front behaviour; prolonged poor weather"] },
    { heading: "Weather Products", points: ["METAR: routine hourly (or half-hourly) aerodrome weather observation", "SPECI: special report when conditions change rapidly (e.g., visibility drops)", "TAF: terminal aerodrome forecast covering 24 or 30 hours", "SIGMET: hazardous weather alert (severe turbulence, icing, volcanic ash, tropical cyclone)"] },
  ],
  12: [
    { heading: "Airspace Classification", points: ["Class A: 18,000 ASL to FL600 — IFR only, ATC clearance required", "Class B: high-density terminal/en-route (e.g., Vancouver, Toronto) — transponder + ATC clearance", "Class C: major airports — two-way radio and ATC clearance required", "Class D: controlled airports — two-way radio contact required, ATC clearance required", "Class G: uncontrolled — no ATC clearance required, but rules still apply"] },
    { heading: "VFR Cruising Altitudes", points: ["Applies when flying above 3000 ft AGL", "Eastbound (magnetic track 000°–179°): odd thousands + 500 ft (e.g., 3500, 5500, 7500)", "Westbound (magnetic track 180°–359°): even thousands + 500 ft (e.g., 4500, 6500, 8500)", "VFR cruising altitudes do not apply in controlled airspace with an ATC clearance"] },
    { heading: "Low-Level Airways", points: ["Extend from 2200 ft AGL to 17,999 ft ASL", "Width: 4 nm each side of the centreline (8 nm total)", "VFR flight is permitted in the Class E portions of low-level airways", "Marked on VNC and WAC charts — know the symbology"] },
    { heading: "Special Airspace", points: ["ADIZ (Air Defence Identification Zone): file flight plan, squawk assigned code, maintain 2-way radio", "Restricted areas (CYR): permission from controlling authority required", "Danger areas (CYD): potentially hazardous operations — check NOTAMs", "Military operations areas: high-speed traffic possible — NOTAMs essential"] },
  ],
  13: [
    { heading: "IMSAFE Checklist", points: ["Illness: any current sickness or symptoms affecting performance?", "Medication: any drugs (prescription or OTC) with cockpit-performance side effects?", "Stress: major life stressors degrading focus or decision-making?", "Alcohol: within 8 hours? BAC below 0.08%?", "Fatigue: adequately rested? Not sleep-deprived?", "Emotion: strong emotions (grief, anger, anxiety) affecting judgment?"] },
    { heading: "5 Hazardous Attitudes", points: ["Anti-authority: 'Don't tell me what to do' — antidote: Rules exist for a reason", "Impulsivity: 'Do something NOW' — antidote: Not so fast, think first", "Invulnerability: 'It won't happen to me' — antidote: It could happen to me", "Macho: 'I can handle it' — antidote: Taking chances is foolish", "Resignation: 'What's the use?' — antidote: I can make a difference"] },
    { heading: "Aeronautical Decision Making", points: ["DECIDE model: Detect → Estimate → Choose → Identify → Do → Evaluate", "Situational awareness: accurate, current picture of your environment, aircraft state, and intentions", "Plan ahead — decision quality degrades sharply under pressure and time stress", "Identify and manage hazards before departure, not in the air"] },
  ],
  14: [
    { heading: "Basic Principles", points: ["Aircraft must not exceed its maximum certified gross weight", "Centre of gravity (CG) must remain within the approved CG envelope at all times", "Moment = Weight × Arm (arm = distance from the datum reference point)", "Total moment ÷ Total weight = loaded CG location"] },
    { heading: "CG Effects on Handling", points: ["Forward CG: nose-heavy; more stable; higher stall speed; more drag; requires more back pressure", "Aft CG: tail-heavy; less stable; can become uncontrollable — most dangerous loading condition", "CG shifts as fuel burns — verify it stays within limits throughout the flight", "Passenger and baggage loading significantly affects CG — calculate before every flight"] },
    { heading: "Useful Load & Planning", points: ["Useful load = maximum gross weight − empty weight", "Includes: pilot, passengers, baggage, usable fuel, oil", "If payload + required fuel exceeds useful load, reduce payload — never reduce safety fuel reserve", "Always use the current weight & balance data from the aircraft's journey log"] },
  ],
};

export default function MaterialDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const isAll = id === "all";
  const sectionNum = isAll ? null : parseInt(id);

  const section = isAll ? null : PSTAR_SECTIONS.find((s) => s.number === sectionNum);
  const questions = sectionNum ? getQuestionsBySection(sectionNum) : [];
  const summaryData = sectionNum ? (SECTION_SUMMARIES[sectionNum] ?? []) : [];

  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "summary", label: "Key Concepts", icon: <BookOpen size={16} /> },
    { key: "flashcards", label: `Flashcards (${questions.length})`, icon: <Layers size={16} /> },
    { key: "quiz", label: `Quiz (${questions.length})`, icon: <GraduationCap size={16} /> },
  ];

  if (isAll) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to materials
        </Link>

        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta/10">
            <Trophy size={28} className="text-terracotta" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Full PSTAR Question Bank</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-charcoal/40">
              <span className="rounded-full bg-primary/5 px-3 py-0.5">All 14 Sections</span>
              <span>192 questions · TC TP 11919E · 7th Edition</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/review"
            className="flex items-center gap-4 rounded-2xl border-2 border-terracotta/25 bg-terracotta/5 p-5 transition hover:border-terracotta/40 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta/15">
              <Layers size={22} className="text-terracotta" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-primary">Review Flashcards</p>
              <p className="text-xs text-charcoal/40">20 random cards · spaced repetition</p>
            </div>
            <ArrowRight size={16} className="text-terracotta" />
          </Link>
          <Link
            href="/dashboard/quiz"
            className="flex items-center gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 transition hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-primary">Full Exam Simulation</p>
              <p className="text-xs text-charcoal/40">50 questions · 90% pass · 95% target</p>
            </div>
            <ArrowRight size={16} className="text-primary" />
          </Link>
        </div>

        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-charcoal/30">All 14 sections</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PSTAR_SECTIONS.map((s) => (
            <Link
              key={s.number}
              href={`/dashboard/materials/${s.number}`}
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <span className="w-6 shrink-0 text-sm font-bold text-terracotta">§{s.number}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">{s.title}</p>
                <p className="text-xs text-charcoal/40">{s.questions.length} questions</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                s.difficulty === "easy" ? "bg-green-50 text-green-600" :
                s.difficulty === "hard" ? "bg-red-50 text-red-500" :
                "bg-gold/10 text-amber-700"
              }`}>
                {s.difficulty}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to materials
        </Link>
        <p className="mt-8 text-charcoal/50">Section not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
        <ArrowLeft size={16} /> Back to materials
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Plane size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{section.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-charcoal/40">
            <span className="rounded-full bg-primary/5 px-3 py-0.5">Section {section.number}</span>
            <span>{questions.length} questions</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              section.difficulty === "easy" ? "bg-green-50 text-green-600" :
              section.difficulty === "hard" ? "bg-red-50 text-red-500" :
              "bg-gold/10 text-amber-700"
            }`}>
              {section.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl bg-primary/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setFlipped(false); setCurrentCard(0); }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key ? "bg-white text-primary shadow-sm" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "summary" && (
          <div className="space-y-5">
            {summaryData.length > 0 ? summaryData.map((block) => (
              <div key={block.heading} className="rounded-2xl border border-primary/10 bg-white p-6">
                <h3 className="font-heading text-lg font-semibold text-primary">{block.heading}</h3>
                <ul className="mt-3 space-y-2">
                  {block.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )) : (
              <p className="text-sm text-charcoal/40">No summary available for this section.</p>
            )}
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <div className="mx-auto max-w-lg">
              <button onClick={() => setFlipped(!flipped)} className="w-full text-left">
                <div className={`min-h-[260px] rounded-2xl border bg-white p-8 shadow-lg transition-all duration-300 ${
                  flipped ? "border-green-200 shadow-green-100" : "border-primary/10"
                }`}>
                  {!flipped ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <Plane size={14} className="text-terracotta" />
                        <p className="text-xs font-medium uppercase tracking-wider text-terracotta">Question</p>
                        <span className="ml-auto font-mono text-xs text-charcoal/30">Q {questions[currentCard]?.id}</span>
                      </div>
                      <p className="mt-6 font-heading text-lg font-semibold text-primary leading-snug">
                        {questions[currentCard]?.question}
                      </p>
                      <p className="mt-10 text-sm text-charcoal/30">Tap to reveal answer</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-green-600">Answer</p>
                      <p className="mt-4 text-lg font-semibold leading-relaxed text-charcoal/80">
                        {questions[currentCard]?.options[questions[currentCard].correct]}
                      </p>
                      {questions[currentCard]?.hint && (
                        <div className="mt-6 flex items-start gap-2 rounded-lg bg-gold/10 p-3">
                          <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
                          <p className="text-sm text-amber-800">{questions[currentCard].hint}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); }}
                disabled={currentCard === 0}
                className="rounded-xl border border-primary/15 px-4 py-2 text-sm font-medium text-charcoal/50 transition hover:bg-neutral disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-sm text-charcoal/40">{currentCard + 1} / {questions.length}</span>
              <button
                onClick={() => { setCurrentCard(Math.min(questions.length - 1, currentCard + 1)); setFlipped(false); }}
                disabled={currentCard === questions.length - 1}
                className="rounded-xl border border-primary/15 px-4 py-2 text-sm font-medium text-charcoal/50 transition hover:bg-neutral disabled:opacity-30"
              >
                Next
              </button>
            </div>

            {flipped && (
              <div className="text-center">
                <p className="text-sm text-charcoal/40">How well did you know this?</p>
                <div className="mt-3 flex justify-center gap-2">
                  {[
                    { label: "Again", color: "bg-red-100 text-red-600 hover:bg-red-200" },
                    { label: "Hard", color: "bg-orange-100 text-orange-600 hover:bg-orange-200" },
                    { label: "Good", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" },
                    { label: "Easy", color: "bg-green-100 text-green-600 hover:bg-green-200" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => { setCurrentCard(Math.min(questions.length - 1, currentCard + 1)); setFlipped(false); }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "quiz" && <QuizView questions={questions} />}
      </div>
    </div>
  );
}

function QuizView({ questions }: { questions: PSTARQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 90;
    const targetMet = pct >= 95;
    return (
      <div className="rounded-2xl border border-primary/10 bg-white p-8 text-center">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${targetMet ? "bg-green-50" : passed ? "bg-gold/10" : "bg-red-50"}`}>
          <GraduationCap size={36} className={targetMet ? "text-green-500" : passed ? "text-amber-500" : "text-red-400"} />
        </div>
        <h3 className="mt-4 font-heading text-2xl font-bold text-primary">Quiz Complete!</h3>
        <p className="mt-2 font-heading text-4xl font-bold text-terracotta">{pct}%</p>
        <p className="mt-1 text-sm text-charcoal/50">{score} of {questions.length} correct</p>
        {targetMet && <p className="mt-2 text-sm font-medium text-green-600">Target met — above 95%!</p>}
        {passed && !targetMet && <p className="mt-2 text-sm font-medium text-amber-600">Passing mark reached — push toward 95%</p>}
        {!passed && <p className="mt-2 text-sm font-medium text-red-500">Below 90% — review summary and retry</p>}
        <button
          onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
        >
          <RotateCcw size={16} /> Retry Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-8">
      <div className="flex items-center justify-between text-sm text-charcoal/40">
        <span>Question {current + 1} of {questions.length}</span>
        <span className="font-mono text-xs">Q {q.id}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-primary">{q.question}</h3>
      <div className="mt-6 space-y-3">
        {q.options.map((opt, idx) => {
          let style = "border-primary/10 hover:border-primary/20 hover:bg-neutral/50";
          if (answered && idx === q.correct) style = "border-green-500 bg-green-50";
          else if (answered && idx === selected) style = "border-red-400 bg-red-50";
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${style}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                answered && idx === q.correct ? "bg-green-500 text-white" :
                answered && idx === selected ? "bg-red-400 text-white" :
                "bg-primary/10 text-primary"
              }`}>
                {answered && idx === q.correct ? <Check size={14} /> :
                 answered && idx === selected ? <X size={14} /> :
                 String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && q.hint && (
        <div className="mt-4 rounded-xl bg-gold/10 p-4">
          <p className="text-sm text-amber-800"><span className="font-semibold">Tip: </span>{q.hint}</p>
        </div>
      )}
      {answered && (
        <button onClick={handleNext} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600">
          {current + 1 >= questions.length ? "See Results" : "Next Question"} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
