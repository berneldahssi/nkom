# NKOM Context-Aware AI Generation System
## Requirements & Design Specification

**Document Status:** Requirements & Architecture Design
**Version:** 1.0
**Date:** February 2026
**Audience:** Project Manager, Senior Dev, Product Owner

---

## EXECUTIVE SUMMARY

The current NKOM upload flow lacks critical metadata context that guides AI generation. Without understanding **who** is learning and **what** they're learning about, the AI cannot:

- Adjust complexity level appropriately (secondary student vs. university vs. professional)
- Avoid hallucination (no subject domain grounding)
- Generate relevant examples (no educational context)
- Customize output format (no learner profile awareness)
- Categorize knowledge meaningfully (no domain/subject mapping)

**Solution:** Implement a lightweight context capture system that collects minimal essential metadata during upload, enabling precise AI generation without adding friction to the user experience.

---

## 1. CONTEXT LAYERS (PM PERSPECTIVE)

### 1.1 Why This Matters

**Without context:**
```
User uploads: "Photosynthesis notes" → AI generates generic summary
Problem: Too basic for university student? Too complex for 10-year-old?
```

**With context:**
```
User uploads: "Photosynthesis notes"
  + Context: University biology student, exam prep
  + AI generates: Advanced summary targeting exam concepts
```

### 1.2 Three Essential Context Layers

#### Layer 1: LEARNER CONTEXT
**Why needed:** AI must match complexity, language, and example level to the learner
**Hallucination risk:** Without this, AI guesses wrong about audience
**Status:** HIGH PRIORITY - fundamental to all generation

#### Layer 2: CONTENT CONTEXT
**Why needed:** AI must understand the subject domain and learning objective
**Hallucination risk:** Without this, AI may generate content that contradicts domain standards
**Status:** HIGH PRIORITY - prevents topic drift

#### Layer 3: LEARNING STYLE CONTEXT
**Why needed:** Customize output format (visual diagrams, audio explanations, kinesthetic examples)
**Hallucination risk:** Generated format won't match learner preference
**Status:** MEDIUM PRIORITY - can enhance but not block generation

---

## 2. MINIMAL REQUIRED FIELDS

### 2.1 Learner Profile (REQUIRED - collected once, stored in user profile)

The learner profile is captured during onboarding/settings and reused for all uploads. These fields represent the **absolute minimum** needed for safe, relevant generation.

#### User Role (REQUIRED)
```
Type: Select (single choice)
Options:
  - Student (K-12)          [ages 5-18]
  - Undergraduate           [university years 1-3]
  - Graduate/Postgraduate   [master's, PhD, professional research]
  - Professional            [working in field, continuing education]
  - Self-learner            [independent study, no formal context]
  - Educator                [teacher, trainer, creating materials]

Why: Fundamentally changes complexity, pace, depth
Example impact:
  - Role=K-12 → "use simple language, basic examples"
  - Role=Postgraduate → "research-level depth, advanced concepts"
```

#### Education Level/Year (CONDITIONAL - required if Student/Undergraduate)
```
Type: Select (single choice)
Visible only if: Role = Student OR Undergraduate
Options:
  - Primary (ages 5-12)      [Grades 1-6]
  - Secondary Lower (13-15)  [Grades 7-9]
  - Secondary Upper (16-18)  [Grades 10-12, BAC/GCE/A-Levels]
  - Year 1-3 (University)    [Undergraduate years]

Why: Determines curriculum alignment
Example impact:
  - Level=Secondary Upper → Include exam-style questions
  - Level=Primary → Avoid abstract concepts
```

#### Field of Study (REQUIRED)
```
Type: Select (with search/categorization)
Categories:
  STEM:
    - Biology & Life Sciences
    - Chemistry
    - Physics
    - Mathematics
    - Engineering
    - Computer Science

  HUMANITIES:
    - History
    - Literature & Languages
    - Philosophy
    - Arts & Design
    - Music

  SOCIAL SCIENCES:
    - Economics
    - Psychology
    - Sociology
    - Political Science
    - Business & Management

  PROFESSIONAL:
    - Medicine
    - Law
    - Finance
    - Technology (Professional)
    - Other

Why: Enables domain-specific generation rules and terminology
Example impact:
  - Field=Medicine → Use medical terminology, cite research
  - Field=History → Provide context and primary sources
  - Field=Math → Include proofs and derivations
```

#### Language Preference (OPTIONAL but recommended)
```
Type: Select
Options: English, French, Spanish, Other
Why: Ensures generated content is in learner's language
Status: OPTIONAL for MVP but critical for diaspora market
```

---

### 2.2 Content Metadata (REQUIRED at upload time)

These fields are captured when user uploads material. They provide context-specific information about **this particular upload**.

#### Content Title/Lesson Name (REQUIRED)
```
Type: Text input (max 100 chars)
Placeholder: "Biology Chapter 5: Photosynthesis"
Why: Names what's being learned
AI impact: Used in prompt to ground generation
Validation: Min 5 chars, max 100 chars
```

#### Content Subject (REQUIRED)
```
Type: Select (filtered by user's field of study)
Example for Biology field:
  - General Biology
  - Cell Biology
  - Genetics
  - Ecology
  - Human Anatomy
  - Microbiology
  - Botany
  - Zoology

Why: Provides domain grounding for AI
AI impact: "Generate content for a [Subject] student studying [Content Title]"
Prevents: AI wandering into unrelated topics
```

#### Content Description (RECOMMENDED)
```
Type: Textarea (max 300 chars)
Placeholder: "Notes from lecture 5, covers photosynthesis light reactions and Calvin cycle. Exam coming in 2 weeks."
Why: Provides learning objective and context
AI impact: Helps AI understand what aspects to emphasize
Example: If "exam in 2 weeks" → Generate exam-style questions
Validation: Optional but strongly encouraged (can be marked with asterisk)
Status: RECOMMENDED (can be skipped but loses personalization)
```

#### Content Type (AUTO-DETECTED, user can override)
```
Type: Select (auto-detected, user can change)
Options:
  - Lecture Notes
  - Textbook Chapter
  - Research Paper
  - Study Guide
  - Exam/Test
  - Presentation Slides
  - Personal Notes
  - Other

Why: Different content types need different generation approaches
AI impact:
  - Lecture Notes → Extract key concepts, structure logically
  - Research Paper → Focus on methodology and findings
  - Exam → Generate similar difficulty questions
Auto-detection: Based on file type and content patterns
```

---

## 3. OPTIONAL CONTEXT FIELDS

These enhance generation but are NOT required to start processing. They should be optional to maintain UX simplicity.

### 3.1 Learning Objectives (OPTIONAL)
```
Type: Checkboxes (multiple select)
Options:
  - Understand concepts
  - Prepare for exam
  - Develop skills
  - Build portfolio
  - Reference material
  - Teaching others

Why: Customizes generation focus
AI impact:
  - Exam prep → More practice questions, past exam patterns
  - Teaching → Beginner-friendly explanations
  - Skills → More practical examples
```

### 3.2 Time Available (OPTIONAL)
```
Type: Select
Options:
  - Less than 1 hour (quick review)
  - 1-3 hours (single study session)
  - 1-2 weeks (exam prep)
  - Ongoing (reference material)

Why: Affects depth and breadth of generation
AI impact:
  - Less than 1 hour → Focus on top 3 concepts, quick review format
  - 1-2 weeks → Deep coverage, phased learning path
```

### 3.3 Difficulty Level (OPTIONAL - if overriding detected level)
```
Type: Select
Options:
  - Beginner/Introduction
  - Intermediate
  - Advanced
  - Expert

Why: User can override AI's complexity detection
AI impact: Explicitly tells AI "make this simpler/harder"
Note: Only appears if user wants to override auto-detected level
```

---

## 4. DATA MODEL (SENIOR DEV PERSPECTIVE)

### 4.1 Database Schema Changes

#### Users Table (existing - add context fields)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP,

  -- NEW CONTEXT FIELDS --
  user_role VARCHAR NOT NULL CHECK (user_role IN ('student', 'undergraduate', 'graduate', 'professional', 'self-learner', 'educator')),
  education_level VARCHAR CHECK (education_level IN ('primary', 'secondary-lower', 'secondary-upper', 'year-1', 'year-2', 'year-3')),
  field_of_study VARCHAR NOT NULL,
  language_preference VARCHAR DEFAULT 'English',

  -- VARK Learning Style (existing) --
  learning_style_visual INT,
  learning_style_auditory INT,
  learning_style_reading INT,
  learning_style_kinesthetic INT,

  updated_at TIMESTAMP
);
```

**Rationale:**
- User role + education level + field of study = complete learner profile
- These change rarely (reuse for all uploads)
- Indexed for filtering/analytics

#### ContentUploads Table (NEW - for context storage)
```sql
CREATE TABLE content_uploads (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),

  -- CONTENT METADATA --
  title VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  description TEXT,
  content_type VARCHAR CHECK (content_type IN ('lecture', 'textbook', 'paper', 'guide', 'exam', 'slides', 'notes', 'other')),

  -- LEARNING CONTEXT --
  learning_objectives JSONB, -- ["exam-prep", "understand-concepts", "build-skills"]
  time_available VARCHAR, -- "1-3 hours", "1-2 weeks", etc.
  difficulty_override VARCHAR, -- "beginner", "intermediate", "advanced", null=auto-detect

  -- FILE STORAGE --
  file_path VARCHAR,
  file_type VARCHAR,
  file_size INT,

  -- STATUS & TIMESTAMPS --
  status VARCHAR DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'error')),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,

  -- FOREIGN KEY --
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Rationale:**
- Stores all context collected during upload
- JSONB for flexible arrays (learning objectives)
- Enables filtering/reporting on context later
- Allows A/B testing different context combinations

#### StudyMaterials Table (update to reference context)
```sql
CREATE TABLE study_materials (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  upload_id UUID NOT NULL REFERENCES content_uploads(id),

  -- MATERIAL CONTENT --
  summary TEXT,
  key_concepts JSONB,

  -- CONTEXT USED FOR GENERATION (denormalized for speed) --
  generated_for_role VARCHAR,
  generated_for_level VARCHAR,
  generated_for_field VARCHAR,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Rationale:**
- Denormalize context used for generation (for analytics/debugging)
- Can regenerate with different context if needed
- Track which context produced which output

---

## 5. AI GENERATION RULES (SENIOR DEV PERSPECTIVE)

### 5.1 Context-to-Prompt Mapping

The context fields directly map to AI prompt engineering. This is how we prevent hallucination:

```
BASE PROMPT TEMPLATE:
"""
You are an educational AI tutor. The student is:
- Role: {user_role} (e.g., "secondary school student")
- Level: {education_level} (e.g., "ages 16-18")
- Field: {field_of_study} (e.g., "Biology")
- Learning Style: {dominant_vark_style} (e.g., "Visual")

They are uploading: {content_title}
From subject: {content_subject}

Context: {content_description}
Objective: {learning_objectives.join(', ')}

Generate study materials appropriate for this specific learner.
Use examples and language that match their level.
Avoid assumptions about what they know.
"""
```

### 5.2 Role-Based Generation Rules

```javascript
const roleGenerationRules = {
  'student-k12': {
    language: 'simple',
    examples: 'everyday-life',
    depth: 'foundational',
    focus: 'memorization-and-understanding',
  },
  'undergraduate': {
    language: 'technical',
    examples: 'field-specific',
    depth: 'detailed',
    focus: 'application-and-analysis',
  },
  'graduate': {
    language: 'research-level',
    examples: 'research-papers',
    depth: 'comprehensive',
    focus: 'critical-thinking-and-synthesis',
  },
  'professional': {
    language: 'industry-standard',
    examples: 'real-world-scenarios',
    depth: 'practical',
    focus: 'skill-application',
  },
};
```

### 5.3 Learning Style Customization Rules

```javascript
const styleToGenerationFormat = {
  'visual': {
    summary: 'include ASCII diagrams and visual structure',
    flashcards: 'emphasize visual patterns and color coding',
    quiz: 'include chart interpretation questions',
    podcast: 'mention "visual elements" for reference',
  },
  'auditory': {
    summary: 'use mnemonic devices and rhythm',
    flashcards: 'include pronunciation and phonetic patterns',
    quiz: 'dialogue-based scenarios',
    podcast: 'detailed vocal explanation version',
  },
  'kinesthetic': {
    summary: 'include step-by-step procedures and movement descriptions',
    flashcards: 'action-oriented verbs and physical examples',
    quiz: 'practical problem-solving scenarios',
    podcast: 'include "try this" practical activities',
  },
};
```

### 5.4 Field-Specific Generation Rules

```javascript
const fieldSpecificRules = {
  'biology': {
    mustInclude: ['scientific names', 'biological processes', 'recent research'],
    sources: ['peer-reviewed journals', 'textbook standards'],
    examples: ['real organisms', 'biological systems'],
  },
  'history': {
    mustInclude: ['dates', 'primary sources', 'multiple perspectives'],
    sources: ['historical records', 'academic consensus'],
    examples: ['specific events', 'historical figures'],
  },
  'mathematics': {
    mustInclude: ['proofs', 'worked examples', 'application domains'],
    sources: ['mathematical principles', 'theorem references'],
    examples: ['step-by-step solutions', 'real-world applications'],
  },
  // ... more fields
};
```

---

## 6. UX/UI IMPLEMENTATION (NO FRICTION)

### 6.1 User Flow: Context Collection

#### Phase 1: Onboarding (One-time)
```
User Registration Flow:
1. Email/auth (existing)
2. Quick Profile Setup (2 minutes):
   - What's your role? [dropdown with 6 options]
   - What's your field of study? [searchable dropdown]
   - Language? [English/French/Spanish]
   - [Take learning style quiz - already exists]
3. Ready to start!

→ This data is REUSED for all future uploads
→ User can update in Settings anytime
```

#### Phase 2: Content Upload (minimal additions)
```
Current Flow (existing):
1. Choose input mode [photo/audio/pdf/text] ✓
2. Upload file/paste text ✓
3. [NEW] Add context (60 seconds):
   a. What's this lesson called? [text input]
   b. What subject? [dropdown - filtered by their field]
   c. [OPTIONAL] Tell us more [textarea - collapsible]
   d. [OPTIONAL] What's your goal? [checkboxes]
4. Generate materials ✓
```

### 6.2 UI Placement & Design

```
UPLOAD PAGE STRUCTURE:

┌─────────────────────────────┐
│ Upload New Material          │
└─────────────────────────────┘

[Step 1: Choose Input Mode] ✓ EXISTING
┌─────────────────────────────┐
│ Photo │ Audio │ PDF │ Text  │
└─────────────────────────────┘

[Step 2: Upload Content] ✓ EXISTING
┌─────────────────────────────┐
│ [File upload / text input]   │
└─────────────────────────────┘

[Step 3: ADD CONTEXT] ✓ NEW
┌─────────────────────────────┐
│ Lesson Name *               │
│ [e.g., Chapter 5 Notes]     │
│                             │
│ Subject *                   │
│ [Biology ▼]                 │
│                             │
│ Tell us more (optional)     │
│ [Expand ▼] Collapsible      │
│   What's this about?        │
│   When do you need it?      │
│   Your goal?                │
└─────────────────────────────┘

[Process Button] → Process with AI
```

### 6.3 Validation & Error Handling

```
REQUIRED FIELDS (blocking):
- Lesson Name: min 5 chars, max 100 chars
- Subject: must select from list (validates against user's field)
- Content (file or text): must have substance

RECOMMENDED FIELDS (warning):
- Description: Shows subtle warning "Descriptions help AI generate more relevant content"
- Learning objectives: Optional but encourages selection

ERROR MESSAGES:
❌ "Please enter a lesson name"
❌ "Subject doesn't match your field - are you sure?"
⚠️ "No description? AI works better with context"
✅ "All set! Ready to process"
```

---

## 7. IMPLEMENTATION ROADMAP

### Phase 1: MVP Context System (Week 1)
- [ ] Add `user_role`, `education_level`, `field_of_study` to User model
- [ ] Create `ContentUploads` table with metadata
- [ ] Add 2 required fields to upload UI: Lesson Name + Subject
- [ ] Update API to store upload metadata
- [ ] Update AI prompt template with basic context variables

### Phase 2: Enhanced Context (Week 2)
- [ ] Add optional content description field
- [ ] Add learning objectives checkboxes
- [ ] Implement field-specific generation rules
- [ ] Add role-based prompt customization
- [ ] Test prompt generation with different contexts

### Phase 3: Full Context Integration (Week 3)
- [ ] Add learning style integration to prompts
- [ ] Implement time-available optimization
- [ ] Add difficulty override option
- [ ] Create analytics dashboard for context data
- [ ] A/B test different context combinations

### Phase 4: Polish & Optimization (Week 4)
- [ ] Collect user feedback on context collection
- [ ] Optimize prompt templates based on results
- [ ] Add context in user dashboard (show what we know about them)
- [ ] Settings page for updating learner profile
- [ ] Documentation for field mapping

---

## 8. METRICS & SUCCESS CRITERIA

### 8.1 Technical Metrics
- **Prompt Consistency:** AI generates same quality with context vs. without
- **Context Coverage:** >90% of uploads have required context
- **Generation Time:** No increase in latency with context processing
- **Database Efficiency:** Context queries <100ms

### 8.2 Product Metrics
- **User Satisfaction:** Users report more relevant content (NPS +10)
- **Content Quality:** Fewer "irrelevant generation" complaints
- **Completion Rate:** Users complete lesson name + subject (>95%)
- **AI Accuracy:** Fewer hallucinations (field-specific errors down 50%)

### 8.3 Business Metrics
- **Retention:** Users who provide context have 20% higher retention
- **Feature Adoption:** >60% of users complete optional context fields
- **Error Rate:** AI generation errors drop by 40%

---

## 9. IMPLEMENTATION PRIORITIES (CRITICAL → NICE-TO-HAVE)

### CRITICAL (Must Have - MVP)
1. ✅ User role + education level + field of study (learner profile)
2. ✅ Lesson name + subject (content metadata)
3. ✅ Basic context → prompt mapping
4. ✅ Store context in database

### HIGH (Should Have - v1.1)
1. Content description field
2. Field-specific generation rules
3. Role-based complexity adjustment
4. Learning style → output format mapping

### MEDIUM (Nice to Have - v1.2)
1. Learning objectives selection
2. Time available optimization
3. Difficulty override option
4. Content type detection

### LOW (Future Enhancements)
1. Context analytics dashboard
2. Collaborative learning context (studying together)
3. Context-based recommendations
4. Multi-language context-specific generation

---

## 10. RISK MITIGATION

### Risk 1: User Friction from Required Fields
**Impact:** Users abandon upload if too many required fields
**Mitigation:**
- Only 2 required fields at upload (name + subject)
- All heavy lifting done in onboarding (one-time)
- Progressive disclosure (optional fields hidden by default)

### Risk 2: Stale Context
**Impact:** User's level changes, old context becomes invalid
**Mitigation:**
- Allow context updates in settings
- Prompt users to update profile yearly
- Show context in dashboard (transparency)

### Risk 3: Context Bias
**Impact:** AI stereotypes based on role/level/field
**Mitigation:**
- Regular audits of generated content
- Diverse prompt examples in training
- User feedback loop for bias detection

### Risk 4: Over-Engineering Prompts
**Impact:** Complex prompts lead to inconsistent outputs
**Mitigation:**
- Start simple (one role-based adjustment)
- Test each variable independently
- Monitor output quality metrics

---

## 11. ACCEPTANCE CRITERIA

### For Development Team:
- [ ] All context fields stored in database
- [ ] Upload API accepts context parameters
- [ ] Context variables available in AI prompt
- [ ] No increase in API latency (>50ms)
- [ ] All field validations working
- [ ] Tests cover context edge cases

### For Product Owner:
- [ ] Upload flow feels natural (no added friction)
- [ ] Generated content noticeably improves with context
- [ ] >85% of users complete required fields
- [ ] Settings page shows stored context
- [ ] Users can update their profile

### For Project Manager:
- [ ] On-time delivery (4 weeks total)
- [ ] Within budget (no additional costs)
- [ ] Zero production issues in first week
- [ ] User feedback collected and documented
- [ ] Ready for v1.1 enhancement roadmap

---

## 12. QUESTIONS FOR CONFIRMATION

Before proceeding with implementation, please confirm:

1. **User Role Options:** Are the 6 role options (Student/Undergrad/Graduate/Professional/Self-learner/Educator) comprehensive for your target market?

2. **Field of Study:** Should we use a custom categorization for African educational systems (BAC, GCE) or use our current general categories?

3. **Content Description:** Make this required or optional? (Tradeoff: quality vs. friction)

4. **Learning Styles:** Should VARK results directly influence generation, or just as a fallback option?

5. **Onboarding Timing:** Collect full profile during signup, or gradually during first few uploads?

6. **Generation Regeneration:** If user provides new context, should we regenerate materials automatically or let them request it?

---

## APPENDIX A: Example Contexts

### Example 1: Secondary School Biology Student
```json
{
  "learner_context": {
    "user_role": "student",
    "education_level": "secondary-upper",
    "field_of_study": "Biology",
    "learning_style_dominant": "visual",
    "language": "English"
  },
  "content_context": {
    "title": "Photosynthesis: Light Reactions",
    "subject": "Cell Biology",
    "description": "Lecture notes from class, exam in 2 weeks covering light reactions and electron transport chain",
    "learning_objectives": ["exam-prep", "understand-concepts"],
    "time_available": "1-2 weeks"
  },
  "ai_instruction": "Generate exam-style study materials for a 16-year-old student preparing for their biology exam. Focus on light reactions. Include visual diagrams (use ASCII art), clear explanation of electron transport, and 5 exam-style questions matching their exam format. Use simple language suitable for secondary school."
}
```

### Example 2: Graduate Research Student
```json
{
  "learner_context": {
    "user_role": "graduate",
    "education_level": null,
    "field_of_study": "Computer Science",
    "learning_style_dominant": "kinesthetic",
    "language": "English"
  },
  "content_context": {
    "title": "Transformer Architecture Deep Dive",
    "subject": "Machine Learning",
    "description": "Research paper on attention mechanisms, building intuition for implementing custom transformers",
    "learning_objectives": ["build-skills", "reference-material"],
    "time_available": "ongoing"
  },
  "ai_instruction": "For a graduate-level computer science student, create research-level study materials. This is a deep technical paper on transformers. Include: 1) Implementation walkthrough with code examples, 2) Proofs of key concepts, 3) Research extensions and open questions, 4) Practical coding challenges. Assume strong mathematical background."
}
```

### Example 3: Professional Skill Development
```json
{
  "learner_context": {
    "user_role": "professional",
    "education_level": null,
    "field_of_study": "Finance",
    "learning_style_dominant": "reading",
    "language": "English"
  },
  "content_context": {
    "title": "ESG Investment Strategies",
    "subject": "Sustainable Finance",
    "description": "Industry whitepaper on ESG metrics and portfolio construction, need to understand for client meetings",
    "learning_objectives": ["skill-application", "reference-material"],
    "time_available": "1-3 hours"
  },
  "ai_instruction": "For a finance professional studying ESG strategies, create practical study materials: 1) Executive summary highlighting key takeaways, 2) Industry-standard terminology glossary, 3) Real-world case studies of ESG portfolio implementation, 4) Talking points for client discussions. Use industry jargon and focus on immediate application."
}
```

---

**END OF DOCUMENT**

---

**Next Steps:**
1. Review this design with team
2. Confirm on the 12 questions for confirmation
3. Create tickets for Phase 1 (MVP) implementation
4. Schedule database migration planning
