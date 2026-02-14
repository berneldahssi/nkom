# NKOM — Architecture & Design Diagrams

> All diagrams use [Mermaid](https://mermaid.js.org/) syntax.
> View them rendered on GitHub, or paste into [mermaid.live](https://mermaid.live) for an interactive editor.

---

## Table of Contents

1. [Full Infrastructure Architecture](#1-full-infrastructure-architecture)
2. [Deployment Strategy (Budget-Friendly)](#2-deployment-strategy--cost-breakdown)
3. [Database Schema (ER Diagram)](#3-database-schema-er-diagram)
4. [User Flow — Core Journey](#4-user-flow--core-journey)
5. [AI Content Processing Pipeline](#5-ai-content-processing-pipeline)
6. [Spaced Repetition Algorithm Flow](#6-spaced-repetition-algorithm-flow)
7. [Authentication Flow](#7-authentication-flow)
8. [API Architecture](#8-api-architecture)
9. [CI/CD Pipeline](#9-cicd-pipeline)

---

## 1. Full Infrastructure Architecture

```mermaid
graph TB
    subgraph CLIENTS["🖥️ CLIENT LAYER"]
        direction LR
        WEB["🌐 Web App<br/><b>Next.js 14</b><br/>Vercel"]
        IOS["📱 iOS App<br/><b>React Native</b><br/>App Store"]
        ANDROID["📱 Android App<br/><b>React Native</b><br/>Play Store"]
    end

    subgraph EDGE["🌍 EDGE / CDN"]
        VERCEL_EDGE["Vercel Edge Network<br/><i>Global CDN, SSL, Cache</i>"]
        CF_R2["Cloudflare R2<br/><i>File Storage + CDN</i>"]
    end

    subgraph GATEWAY["🚪 API GATEWAY"]
        APIGW["API Gateway<br/><b>Railway / Render</b><br/><i>Rate Limiting, Auth, Routing</i>"]
    end

    subgraph BACKEND["⚙️ APPLICATION LAYER"]
        direction LR
        AUTH["🔐 Auth Service<br/><i>JWT + OAuth2</i>"]
        CONTENT["📄 Content Service<br/><i>Upload, Process, Extract</i>"]
        LEARNING["🧠 Learning Engine<br/><i>Spaced Repetition</i>"]
        QUIZ["📝 Quiz Service<br/><i>Generation + Scoring</i>"]
        PROGRESS["📊 Progress Service<br/><i>Analytics + Tracking</i>"]
        NOTIF["🔔 Notification Service<br/><i>Push + Email</i>"]
    end

    subgraph AI["🤖 AI LAYER"]
        direction LR
        GPT4["OpenAI GPT-4<br/><i>Content Generation</i>"]
        WHISPER["Whisper API<br/><i>Speech → Text</i>"]
        ELEVEN["ElevenLabs<br/><i>Text → Speech</i>"]
        OCR["Tesseract OCR<br/><i>Image → Text</i>"]
        DALLE["DALL-E 3<br/><i>Visual Generation</i><br/><small>(Phase 2)</small>"]
    end

    subgraph DATA["💾 DATA LAYER"]
        direction LR
        PG["🐘 PostgreSQL<br/><b>Supabase / Neon</b><br/><i>Primary Database</i>"]
        REDIS["⚡ Redis<br/><b>Upstash</b><br/><i>Cache + Sessions</i>"]
        S3["📦 Object Storage<br/><b>Cloudflare R2</b><br/><i>User Uploads</i>"]
    end

    subgraph MONITORING["📡 OBSERVABILITY"]
        direction LR
        SENTRY["Sentry<br/><i>Error Tracking</i>"]
        ANALYTICS["Mixpanel<br/><i>Product Analytics</i>"]
        LOGS["Betterstack<br/><i>Logs + Uptime</i>"]
    end

    WEB --> VERCEL_EDGE
    IOS --> APIGW
    ANDROID --> APIGW
    VERCEL_EDGE --> APIGW

    APIGW --> AUTH
    APIGW --> CONTENT
    APIGW --> LEARNING
    APIGW --> QUIZ
    APIGW --> PROGRESS
    APIGW --> NOTIF

    CONTENT --> GPT4
    CONTENT --> WHISPER
    CONTENT --> OCR
    LEARNING --> GPT4
    QUIZ --> GPT4
    NOTIF --> ELEVEN

    AUTH --> PG
    CONTENT --> PG
    CONTENT --> S3
    LEARNING --> PG
    LEARNING --> REDIS
    QUIZ --> PG
    PROGRESS --> PG
    NOTIF --> REDIS

    S3 --> CF_R2

    AUTH --> SENTRY
    CONTENT --> SENTRY
    APIGW --> ANALYTICS
    APIGW --> LOGS

    classDef clients fill:#E8EEF5,stroke:#1E3A5F,color:#1E3A5F
    classDef edge fill:#F5E7B3,stroke:#D4AF37,color:#2C2C2C
    classDef gateway fill:#F2D1C5,stroke:#C75B39,color:#2C2C2C
    classDef backend fill:#1E3A5F,stroke:#1E3A5F,color:#fff
    classDef ai fill:#C75B39,stroke:#C75B39,color:#fff
    classDef data fill:#152B48,stroke:#1E3A5F,color:#fff
    classDef monitoring fill:#F5F5F0,stroke:#2C2C2C,color:#2C2C2C

    class WEB,IOS,ANDROID clients
    class VERCEL_EDGE,CF_R2 edge
    class APIGW gateway
    class AUTH,CONTENT,LEARNING,QUIZ,PROGRESS,NOTIF backend
    class GPT4,WHISPER,ELEVEN,OCR,DALLE ai
    class PG,REDIS,S3 data
    class SENTRY,ANALYTICS,LOGS monitoring
```

---

## 2. Deployment Strategy & Cost Breakdown

```mermaid
graph LR
    subgraph FREE["💚 FREE TIER — $0/month"]
        V["🌐 <b>Vercel</b><br/>Frontend<br/><i>100GB bandwidth</i>"]
        N["🐘 <b>Neon / Supabase</b><br/>PostgreSQL<br/><i>500MB storage</i>"]
        U["⚡ <b>Upstash</b><br/>Redis<br/><i>10K commands/day</i>"]
        R2["📦 <b>Cloudflare R2</b><br/>File Storage<br/><i>10GB free, no egress</i>"]
        SE["🐛 <b>Sentry</b><br/>Error Tracking<br/><i>5K events/month</i>"]
        MP["📊 <b>Mixpanel</b><br/>Analytics<br/><i>20M events/month</i>"]
        GH["🔄 <b>GitHub Actions</b><br/>CI/CD<br/><i>2000 min/month</i>"]
    end

    subgraph CHEAP["💛 CHEAP — ~$7/month"]
        RW["⚙️ <b>Railway</b><br/>Backend API<br/><i>$5/month</i>"]
    end

    subgraph API_COSTS["🧡 USAGE-BASED"]
        OA["🤖 <b>OpenAI API</b><br/>GPT-4 + Whisper<br/><i>~$0.01-0.05/request</i>"]
        EL["🎙️ <b>ElevenLabs</b><br/>Text-to-Speech<br/><i>Free: 10K chars/month</i>"]
    end

    style FREE fill:#E8F5E9,stroke:#4CAF50
    style CHEAP fill:#FFF8E1,stroke:#FFC107
    style API_COSTS fill:#FFF3E0,stroke:#FF9800
```

### Monthly Cost Estimate (MVP)

| Service | What | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Frontend hosting | **$0** | Hobby plan, 100GB bandwidth |
| **Neon** | PostgreSQL database | **$0** | 500MB storage, autoscale |
| **Upstash** | Redis cache | **$0** | 10K commands/day |
| **Cloudflare R2** | File uploads | **$0** | 10GB free, zero egress |
| **Railway** | FastAPI backend | **$5** | 8GB RAM, deploy from Git |
| **OpenAI** | GPT-4 + Whisper | **~$15-30** | Usage-based, ~500 users |
| **ElevenLabs** | Text-to-speech | **$0** | Free tier: 10K chars |
| **Sentry** | Error tracking | **$0** | 5K events free |
| **GitHub Actions** | CI/CD | **$0** | 2000 min/month free |
| | | **~$20-35/month** | |

---

## 3. Database Schema (ER Diagram)

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK "NOT NULL"
        varchar password_hash "NOT NULL"
        varchar first_name
        varchar last_name
        varchar phone
        varchar country
        varchar timezone
        varchar learning_style "visual|auditory|reading|kinesthetic"
        boolean is_premium "DEFAULT false"
        varchar subscription_tier "free|student|pro|family"
        timestamp subscription_expires_at
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at
        timestamp last_active
    }

    CONTENT_UPLOADS {
        uuid id PK
        uuid user_id FK
        varchar file_type "image|audio|pdf|text"
        varchar file_url
        varchar original_filename
        text extracted_text
        jsonb extracted_concepts
        varchar processing_status "pending|processing|completed|failed"
        timestamp created_at "DEFAULT NOW()"
    }

    STUDY_MATERIALS {
        uuid id PK
        uuid user_id FK
        uuid content_id FK
        varchar title
        varchar subject
        text description
        varchar source_type "lecture_notes|textbook|article"
        text summary
        varchar podcast_url
        jsonb generated_formats
        integer difficulty_level "1-5"
        timestamp created_at "DEFAULT NOW()"
    }

    FLASHCARDS {
        uuid id PK
        uuid material_id FK
        uuid user_id FK
        text front_text "NOT NULL"
        text back_text "NOT NULL"
        text mnemonic_hint
        float ease_factor "DEFAULT 2.5"
        integer interval_days "DEFAULT 0"
        integer repetitions "DEFAULT 0"
        timestamp next_review
        timestamp last_reviewed
        timestamp created_at "DEFAULT NOW()"
    }

    QUIZ_QUESTIONS {
        uuid id PK
        uuid material_id FK
        text question_text "NOT NULL"
        varchar question_type "multiple_choice|true_false|open_ended"
        jsonb options
        text correct_answer
        text explanation
        integer difficulty "1-5"
        timestamp created_at "DEFAULT NOW()"
    }

    STUDY_SESSIONS {
        uuid id PK
        uuid user_id FK
        uuid material_id FK
        varchar session_type "review|quiz|podcast"
        timestamp started_at "DEFAULT NOW()"
        timestamp ended_at
        integer duration_minutes
        integer cards_reviewed
        integer correct_answers
        float score
    }

    QUIZ_ATTEMPTS {
        uuid id PK
        uuid user_id FK
        uuid question_id FK
        uuid session_id FK
        text user_answer
        boolean is_correct
        integer time_spent_seconds
        timestamp created_at "DEFAULT NOW()"
    }

    USERS ||--o{ CONTENT_UPLOADS : uploads
    USERS ||--o{ STUDY_MATERIALS : creates
    USERS ||--o{ FLASHCARDS : owns
    USERS ||--o{ STUDY_SESSIONS : starts
    USERS ||--o{ QUIZ_ATTEMPTS : attempts
    CONTENT_UPLOADS ||--o{ STUDY_MATERIALS : generates
    STUDY_MATERIALS ||--o{ FLASHCARDS : contains
    STUDY_MATERIALS ||--o{ QUIZ_QUESTIONS : contains
    STUDY_MATERIALS ||--o{ STUDY_SESSIONS : studied_in
    QUIZ_QUESTIONS ||--o{ QUIZ_ATTEMPTS : answered_in
    STUDY_SESSIONS ||--o{ QUIZ_ATTEMPTS : includes
```

---

## 4. User Flow — Core Journey

```mermaid
flowchart TD
    START(("🚀 User visits<br/>nkom.io")) --> LANDING["Landing Page"]

    LANDING --> SIGNUP["Sign Up<br/><i>Email or OAuth</i>"]
    LANDING --> LOGIN["Sign In"]

    SIGNUP --> ONBOARD["🧠 Learning Style Quiz<br/><i>10 VARK questions</i>"]
    ONBOARD --> DASHBOARD

    LOGIN --> DASHBOARD["📊 Dashboard<br/><i>Stats, Reviews Due,<br/>Recent Materials</i>"]

    DASHBOARD --> UPLOAD["📤 Upload Material"]
    DASHBOARD --> REVIEW["🔄 Review Flashcards"]
    DASHBOARD --> QUIZ_NAV["📝 Take Quiz"]
    DASHBOARD --> ANALYTICS["📈 View Analytics"]
    DASHBOARD --> SETTINGS["⚙️ Settings"]

    UPLOAD --> SELECT_INPUT{"Choose Input<br/>Method"}
    SELECT_INPUT --> PHOTO["📷 Photo / Image"]
    SELECT_INPUT --> AUDIO["🎙️ Audio Recording"]
    SELECT_INPUT --> PDF["📄 PDF Document"]
    SELECT_INPUT --> TEXT["✏️ Paste Text"]

    PHOTO --> PROCESS["🤖 AI Processing<br/><i>OCR → Extract → Generate</i>"]
    AUDIO --> PROCESS
    PDF --> PROCESS
    TEXT --> PROCESS

    PROCESS --> MATERIAL["📚 Material Created<br/><i>Summary + Flashcards<br/>+ Quiz + Podcast</i>"]

    MATERIAL --> VIEW_SUMMARY["📖 View Summary"]
    MATERIAL --> STUDY_CARDS["🃏 Study Flashcards"]
    MATERIAL --> TAKE_QUIZ["📝 Take Quiz"]
    MATERIAL --> LISTEN["🎧 Listen to Podcast"]

    STUDY_CARDS --> SRS["♻️ Spaced Repetition<br/><i>Rate: Again/Hard/Good/Easy</i>"]
    SRS --> |"Scheduled"| REVIEW

    TAKE_QUIZ --> RESULTS["📊 Quiz Results<br/><i>Score + Explanations</i>"]
    RESULTS --> ANALYTICS

    REVIEW --> SRS

    style START fill:#C75B39,color:#fff
    style DASHBOARD fill:#1E3A5F,color:#fff
    style PROCESS fill:#D4AF37,color:#2C2C2C
    style MATERIAL fill:#1E3A5F,color:#fff
    style SRS fill:#C75B39,color:#fff
```

---

## 5. AI Content Processing Pipeline

```mermaid
flowchart TD
    INPUT["📥 User Upload<br/><i>Image / Audio / PDF / Text</i>"]

    INPUT --> DETECT{"Detect<br/>File Type"}

    DETECT --> |"Image"| OCR["🔍 OCR Engine<br/><b>Tesseract + GPT-4V</b><br/><i>Extract text from photo</i>"]
    DETECT --> |"Audio"| STT["🎙️ Speech-to-Text<br/><b>OpenAI Whisper</b><br/><i>Transcribe audio</i>"]
    DETECT --> |"PDF"| PARSE["📄 PDF Parser<br/><b>PyMuPDF</b><br/><i>Extract text + layout</i>"]
    DETECT --> |"Text"| CLEAN["✨ Text Cleaner<br/><i>Normalize + format</i>"]

    OCR --> RAW["📝 Raw Extracted Text"]
    STT --> RAW
    PARSE --> RAW
    CLEAN --> RAW

    RAW --> CONCEPTS["🧠 Concept Extraction<br/><b>GPT-4</b><br/><i>Identify key topics,<br/>definitions, relationships</i>"]

    CONCEPTS --> GEN_PARALLEL

    subgraph GEN_PARALLEL["⚡ Parallel Generation"]
        direction LR
        SUMMARY["📖 Summary<br/><b>GPT-4</b><br/><i>Structured bullet<br/>points by topic</i>"]
        FLASH["🃏 Flashcards<br/><b>GPT-4</b><br/><i>Q&A pairs with<br/>mnemonic hints</i>"]
        QUIZ_GEN["📝 Quiz<br/><b>GPT-4</b><br/><i>MCQ + T/F + Open<br/>with explanations</i>"]
        PODCAST["🎧 Podcast Script<br/><b>GPT-4</b><br/><i>Conversational<br/>teaching script</i>"]
    end

    PODCAST --> TTS["🔊 Text-to-Speech<br/><b>ElevenLabs</b><br/><i>Natural voice audio</i>"]

    SUMMARY --> STORE["💾 Store in Database<br/><i>PostgreSQL + R2</i>"]
    FLASH --> STORE
    QUIZ_GEN --> STORE
    TTS --> STORE

    STORE --> READY["✅ Material Ready<br/><i>Notify user</i>"]

    CONCEPTS --> STYLE{"User's<br/>Learning Style?"}
    STYLE --> |"Visual"| PRIO_V["Prioritize:<br/>Diagrams, Charts"]
    STYLE --> |"Auditory"| PRIO_A["Prioritize:<br/>Podcast first"]
    STYLE --> |"Reading"| PRIO_R["Prioritize:<br/>Detailed summary"]
    STYLE --> |"Kinesthetic"| PRIO_K["Prioritize:<br/>Flashcards + Quiz"]

    style INPUT fill:#C75B39,color:#fff
    style CONCEPTS fill:#1E3A5F,color:#fff
    style GEN_PARALLEL fill:#E8EEF5,stroke:#1E3A5F
    style READY fill:#4CAF50,color:#fff
    style STYLE fill:#D4AF37,color:#2C2C2C
```

---

## 6. Spaced Repetition Algorithm Flow

```mermaid
flowchart TD
    START["🃏 Show Flashcard<br/><i>Front side</i>"] --> REVEAL["User taps to<br/>reveal answer"]

    REVEAL --> RATE{"User rates<br/>difficulty"}

    RATE --> |"1 — Again<br/><i>Didn't know</i>"| AGAIN["Reset card<br/><b>interval = 1 min</b><br/>ease -= 0.20"]
    RATE --> |"2 — Hard<br/><i>Barely recalled</i>"| HARD["Short interval<br/><b>interval × 1.2</b><br/>ease -= 0.15"]
    RATE --> |"3 — Good<br/><i>Recalled correctly</i>"| GOOD["Normal interval<br/><b>interval × ease</b><br/>ease unchanged"]
    RATE --> |"4 — Easy<br/><i>Instant recall</i>"| EASY["Long interval<br/><b>interval × ease × 1.3</b><br/>ease += 0.15"]

    AGAIN --> UPDATE["📊 Update Card"]
    HARD --> UPDATE
    GOOD --> UPDATE
    EASY --> UPDATE

    UPDATE --> SCHEDULE["⏰ Schedule<br/>next_review = NOW + interval"]

    SCHEDULE --> QUEUE{"More cards<br/>in queue?"}
    QUEUE --> |"Yes"| START
    QUEUE --> |"No"| DONE["✅ Session Complete<br/><i>Show results</i>"]

    subgraph INTERVALS["📅 Example Intervals"]
        direction LR
        I1["Day 1"] --> I3["Day 3"]
        I3 --> I7["Day 7"]
        I7 --> I14["Day 14"]
        I14 --> I30["Day 30"]
        I30 --> I90["Day 90"]
    end

    subgraph FORMULA["📐 SuperMemo-2 Formula"]
        F1["<b>ease_factor</b> starts at 2.5<br/>Min: 1.3, Max: 4.0"]
        F2["<b>interval</b> = previous_interval × ease_factor"]
        F3["<b>next_review</b> = last_reviewed + interval"]
    end

    style START fill:#1E3A5F,color:#fff
    style AGAIN fill:#EF5350,color:#fff
    style HARD fill:#FF9800,color:#fff
    style GOOD fill:#42A5F5,color:#fff
    style EASY fill:#4CAF50,color:#fff
    style DONE fill:#C75B39,color:#fff
```

---

## 7. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant App as 🌐 Frontend<br/>(Next.js)
    participant API as ⚙️ Backend<br/>(FastAPI)
    participant DB as 🐘 PostgreSQL
    participant OAuth as 🔑 OAuth Provider<br/>(Google/Apple)

    Note over User,OAuth: === EMAIL REGISTRATION ===
    User->>App: Fill register form
    App->>API: POST /auth/register {email, password, name}
    API->>API: Hash password (bcrypt)
    API->>DB: INSERT user
    DB-->>API: User created
    API-->>App: {access_token, refresh_token}
    App->>App: Store tokens in localStorage
    App->>User: Redirect to /onboarding

    Note over User,OAuth: === OAUTH LOGIN ===
    User->>App: Click "Sign in with Google"
    App->>OAuth: Redirect to Google OAuth
    OAuth-->>App: Authorization code
    App->>API: POST /auth/oauth {provider, code}
    API->>OAuth: Exchange code for tokens
    OAuth-->>API: User profile data
    API->>DB: Find or create user
    DB-->>API: User record
    API-->>App: {access_token, refresh_token}
    App->>User: Redirect to /dashboard

    Note over User,OAuth: === TOKEN REFRESH ===
    User->>App: Make API request
    App->>API: GET /api/v1/... (expired token)
    API-->>App: 401 Unauthorized
    App->>API: POST /auth/refresh {refresh_token}
    API->>API: Verify refresh token
    API-->>App: {new_access_token, new_refresh_token}
    App->>API: Retry original request
    API-->>App: 200 Success
```

---

## 8. API Architecture

```mermaid
graph TB
    subgraph API_ROUTES["🔌 API Routes — /api/v1"]
        direction TB

        subgraph AUTH_API["🔐 Auth"]
            A1["POST /auth/register"]
            A2["POST /auth/login"]
            A3["POST /auth/refresh"]
            A4["POST /auth/logout"]
            A5["POST /auth/forgot-password"]
            A6["POST /auth/oauth"]
        end

        subgraph USER_API["👤 Users"]
            U1["GET /users/me"]
            U2["PUT /users/me"]
            U3["PUT /users/me/learning-style"]
            U4["GET /users/me/progress"]
        end

        subgraph CONTENT_API["📄 Content"]
            C1["POST /content/upload"]
            C2["GET /content/:id"]
            C3["DELETE /content/:id"]
            C4["GET /content/:id/status"]
        end

        subgraph MATERIAL_API["📚 Materials"]
            M1["POST /materials"]
            M2["GET /materials"]
            M3["GET /materials/:id"]
            M4["POST /materials/:id/generate"]
            M5["DELETE /materials/:id"]
        end

        subgraph STUDY_API["🧠 Study"]
            S1["GET /study/sessions"]
            S2["POST /study/sessions"]
            S3["POST /study/flashcards/:id/review"]
            S4["GET /study/quiz/:materialId"]
            S5["POST /study/quiz/submit"]
        end

        subgraph ANALYTICS_API["📊 Analytics"]
            AN1["GET /analytics/overview"]
            AN2["GET /analytics/concepts"]
            AN3["GET /analytics/time-spent"]
            AN4["GET /analytics/performance"]
        end
    end

    subgraph MIDDLEWARE["🛡️ Middleware"]
        MW1["JWT Authentication"]
        MW2["Rate Limiting"]
        MW3["Request Validation<br/>(Pydantic)"]
        MW4["CORS"]
        MW5["Error Handling"]
    end

    CLIENT["Client Request"] --> MW1 --> MW2 --> MW3 --> MW4 --> API_ROUTES

    style AUTH_API fill:#1E3A5F,color:#fff
    style USER_API fill:#1E3A5F,color:#fff
    style CONTENT_API fill:#C75B39,color:#fff
    style MATERIAL_API fill:#C75B39,color:#fff
    style STUDY_API fill:#152B48,color:#fff
    style ANALYTICS_API fill:#152B48,color:#fff
    style MIDDLEWARE fill:#D4AF37,color:#2C2C2C
```

---

## 9. CI/CD Pipeline

```mermaid
flowchart LR
    DEV["👨‍💻 Developer<br/>pushes code"] --> GH["GitHub<br/>Repository"]

    GH --> |"Push to branch"| CI["🔄 GitHub Actions"]

    subgraph CI_STEPS["CI Pipeline"]
        direction TB
        LINT["ESLint<br/><i>Code quality</i>"] --> TYPES["TypeScript<br/><i>Type check</i>"]
        TYPES --> BUILD["Next.js Build<br/><i>Compile + optimize</i>"]
        BUILD --> TEST["Tests<br/><i>Unit + Integration</i>"]
    end

    CI --> CI_STEPS

    CI_STEPS --> |"PR"| PREVIEW["🔍 Preview Deploy<br/><b>Vercel</b><br/><i>Unique URL per PR</i>"]
    CI_STEPS --> |"Merge to main"| PROD["🚀 Production Deploy<br/><b>Vercel</b><br/><i>nkom.io</i>"]

    CI_STEPS --> |"Backend changes"| RAILWAY["🚂 Railway Deploy<br/><b>FastAPI</b><br/><i>api.nkom.io</i>"]

    PROD --> MONITOR["📡 Monitoring<br/><i>Sentry + Mixpanel</i>"]
    RAILWAY --> MONITOR

    style DEV fill:#1E3A5F,color:#fff
    style PREVIEW fill:#D4AF37,color:#2C2C2C
    style PROD fill:#4CAF50,color:#fff
    style RAILWAY fill:#C75B39,color:#fff
```

---

## Quick Reference: Full Stack Deployment

| Layer | Service | Cost | URL |
|-------|---------|------|-----|
| **Frontend** | Vercel | Free | `nkom.io` |
| **Backend API** | Railway | $5/mo | `api.nkom.io` |
| **Database** | Neon (PostgreSQL) | Free | internal |
| **Cache** | Upstash (Redis) | Free | internal |
| **File Storage** | Cloudflare R2 | Free | `cdn.nkom.io` |
| **AI** | OpenAI API | ~$15-30/mo | API key |
| **TTS** | ElevenLabs | Free | API key |
| **Error Tracking** | Sentry | Free | dashboard |
| **Analytics** | Mixpanel | Free | dashboard |
| **CI/CD** | GitHub Actions | Free | built-in |
| | | **~$20-35/mo total** | |

---

> **How to view these diagrams:**
> 1. Push to GitHub — they render automatically in markdown
> 2. Copy any diagram block into [mermaid.live](https://mermaid.live) for interactive editing
> 3. Export as SVG/PNG from mermaid.live for presentations
