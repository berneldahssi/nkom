# NKOM — Business & Development TODO

> **"Own What You Know."** — AI-Powered Personalized Learning Platform
>
> This is the living roadmap for NKOM. Phases are sequential — each builds
> on the previous one. Check items off as you go.

---

## PHASE 0 — Design System & UI Foundation

_Goal: Establish a world-class design language before writing any feature code.
Everything you build afterward inherits this quality._

### 0.1 Design Tokens & Theme

- [ ] Refine the color palette — add semantic tokens (`success`, `warning`, `error`, `info`) to Tailwind config
- [ ] Add subtle gradient definitions for hero sections and card backgrounds
- [ ] Define a consistent spacing scale (4/8/12/16/24/32/48/64/96)
- [ ] Define elevation/shadow system (`shadow-card`, `shadow-modal`, `shadow-dropdown`)
- [ ] Configure CSS `--radius` variable and standardize border-radius usage
- [ ] Add smooth transition/animation defaults (`transition-all duration-200 ease-out`)
- [ ] Set up dark mode token mappings (optional for later, but structure it now)

### 0.2 Typography

- [ ] Load Montserrat (headings) and Inter (body) via `next/font` for performance
- [ ] Define type scale: display, h1-h4, body-lg, body, body-sm, caption, overline
- [ ] Set `font-smoothing` and `text-rendering` for crisp text
- [ ] Ensure consistent `line-height` and `letter-spacing` per size

### 0.3 Reusable Component Library (`frontend/src/components/ui/`)

_Minimalist, accessible, beautiful. Built on Radix UI primitives._

- [ ] **Button** — primary, secondary, ghost, danger, sizes (sm/md/lg), loading state, icon support
- [ ] **Input** — text, email, password (with show/hide toggle), textarea, with labels & error states
- [ ] **Card** — base card, stat card, feature card, material card, with hover micro-interactions
- [ ] **Badge** — status badge (success, warning, info, neutral), tag badge
- [ ] **Avatar** — initials fallback, image, size variants, online indicator
- [ ] **Progress Bar** — linear progress, circular progress ring, animated fill
- [ ] **Skeleton** — skeleton loader shapes (text, card, avatar, chart) for loading states
- [ ] **Toast / Notification** — success, error, info variants using Radix Toast
- [ ] **Dialog / Modal** — confirm dialog, form dialog, fullscreen dialog
- [ ] **Dropdown Menu** — profile menu, context menu, action menu
- [ ] **Tabs** — horizontal tabs, with animated underline indicator
- [ ] **Tooltip** — informational tooltips with smart positioning
- [ ] **Empty State** — illustrated empty states for each section (no materials, no flashcards, etc.)
- [ ] **Icon wrapper** — consistent sizing and color for Lucide icons

### 0.4 Layout Components (`frontend/src/components/layout/`)

- [ ] **AppShell** — sidebar + top bar + main content area responsive layout
- [ ] **Sidebar** — collapsible, active link highlighting with animated indicator, mobile drawer
- [ ] **TopBar** — search bar, notification bell, user avatar dropdown, breadcrumbs
- [ ] **MobileNav** — bottom tab bar for mobile, hamburger menu for tablet
- [ ] **PageHeader** — title + subtitle + action buttons, consistent across pages
- [ ] **ContentContainer** — max-width wrapper with consistent padding

### 0.5 Micro-Interactions & Polish

- [ ] Page transition animations (fade/slide with Next.js)
- [ ] Button press/hover micro-animations (subtle scale + shadow)
- [ ] Card hover elevation lift effect
- [ ] Sidebar link active state animated indicator (sliding pill)
- [ ] Smooth number counting animation for stat cards
- [ ] Skeleton-to-content fade transition
- [ ] Form field focus glow animation
- [ ] Success/error shake and color flash on form submit

---

## PHASE 1 — Beautiful Pages (UI Only, Mock Data)

_Goal: Every page looks production-ready and feels delightful.
Use hardcoded/mock data — no API calls yet. This is your "show to friends" milestone._

### 1.1 Landing Page (`/`)

- [ ] Redesign hero — large headline with subtle gradient text or accent, animated background element
- [ ] Add a compelling subheadline with a brief "how it works" in 3 steps
- [ ] Animated feature cards with staggered entrance on scroll
- [ ] Social proof section — testimonials or "Trusted by X students" (placeholder)
- [ ] Pricing preview section (Free / Student / Pro tiers)
- [ ] Footer — links, socials, legal, NKOM logo
- [ ] Mobile responsive polish — test every breakpoint

### 1.2 Auth Pages (`/auth`)

- [ ] Split layout — left side branding panel (gradient + illustration/pattern), right side form
- [ ] Smooth toggle animation between Login and Register
- [ ] Password strength indicator on registration
- [ ] "Continue with Google" button placeholder (for future OAuth)
- [ ] Remember me checkbox, forgot password link
- [ ] Onboarding step after register — choose learning style (visual cards to pick from)
- [ ] Success animation on account creation (confetti or checkmark)

### 1.3 Dashboard Home (`/dashboard`)

- [ ] Personalized greeting with time-of-day awareness ("Good morning", "Good evening")
- [ ] Animated stat cards with counting-up numbers on mount
- [ ] Study streak visualization (flame icon with streak bar or calendar heatmap)
- [ ] "Continue where you left off" section — last material with progress bar
- [ ] Quick actions as visually distinct cards with icons and descriptions
- [ ] Recent materials as rich cards (title, subject badge, progress indicator, date)
- [ ] Daily goal / study reminder nudge card
- [ ] Today's review schedule (flashcards due, suggested quiz)

### 1.4 Materials Library (`/dashboard/materials`)

- [ ] Grid/list view toggle with smooth layout animation
- [ ] Material cards — thumbnail/icon, title, subject tag, format badges (summary, flashcards, quiz, podcast), progress ring, date
- [ ] Search bar with real-time filtering
- [ ] Filter chips by subject, format, date
- [ ] Sort dropdown (recent, alphabetical, most studied)
- [ ] Empty state with illustration and "Upload your first material" CTA
- [ ] Material detail page (`/dashboard/materials/[id]`) — full summary view, tabs for formats

### 1.5 Upload Page (`/dashboard/upload`)

- [ ] Drag-and-drop zone with animated border and icon
- [ ] Support indicators: camera icon (photo), mic icon (audio), file icon (PDF), text icon
- [ ] File preview after selection (image thumbnail, audio waveform placeholder, PDF preview)
- [ ] Text input alternative — rich textarea with character count
- [ ] Upload progress bar with percentage
- [ ] Processing state — "AI is analyzing your content..." with animated brain icon
- [ ] Completion state — preview of extracted content with "Generate materials" CTA

### 1.6 Flashcard Review (`/dashboard/review`)

- [ ] Flashcard with 3D flip animation (front → back)
- [ ] Swipe gestures on mobile (left = hard, right = easy)
- [ ] Self-rating buttons: Again / Hard / Good / Easy (color-coded)
- [ ] Progress bar showing cards remaining in session
- [ ] Session stats bar (cards reviewed, accuracy, time elapsed)
- [ ] Completion screen with session summary and encouragement message
- [ ] Mnemonic hint reveal button (subtle, expandable)

### 1.7 Quiz Page (`/dashboard/quiz`)

- [ ] Quiz selection — pick a material, see question count and estimated time
- [ ] Question view — clean typography, option cards with radio selection
- [ ] Selected answer highlight with subtle animation
- [ ] Progress indicator (question 3 of 10)
- [ ] Timer (optional, configurable)
- [ ] Results screen — score with circular progress ring, question-by-question breakdown
- [ ] Correct/incorrect indicators with explanation expandable per question

### 1.8 Analytics Dashboard (`/dashboard/analytics`)

- [ ] Study streak calendar heatmap (GitHub-style contribution grid)
- [ ] Line chart — study minutes over last 30 days
- [ ] Bar chart — materials by subject
- [ ] Pie/donut chart — learning format distribution (flashcards vs quiz vs podcast)
- [ ] Stat cards row — total study time, avg score, longest streak, materials mastered
- [ ] Retention curve visualization (spaced repetition effectiveness)
- [ ] "Insights" card with AI-generated study tip (mock)

### 1.9 Settings Page (`/dashboard/settings`)

- [ ] Profile section — avatar upload, name, email (readonly), country, timezone
- [ ] Learning preferences — learning style selector (visual cards), daily goal slider
- [ ] Notification preferences — email digest toggle, review reminders
- [ ] Subscription section — current plan, upgrade CTA, billing placeholder
- [ ] Danger zone — delete account with confirmation dialog
- [ ] Save changes button with success toast

### 1.10 404 & Error Pages

- [ ] Custom 404 page with illustration and back-to-home button
- [ ] Generic error boundary with friendly message and retry button

---

## PHASE 2 — First Functional Feature (Content Upload → AI Materials)

_Goal: The core magic loop works end-to-end. A user can upload something and get
AI-generated study materials back. This is the "wow" moment._

### 2.1 Auth Integration

- [ ] Connect registration form to `POST /auth/register`
- [ ] Connect login form to `POST /auth/login`
- [ ] Store JWT tokens (access + refresh) securely (httpOnly cookies or secure storage)
- [ ] Set up Axios interceptor for auto token refresh on 401
- [ ] Add auth state management with Zustand (user profile, loading, isAuthenticated)
- [ ] Implement protected route middleware (redirect to `/auth` if unauthenticated)
- [ ] Connect logout button to `POST /auth/logout`
- [ ] Implement the learning style onboarding step (call `PUT /users/me/learning-style`)

### 2.2 Content Upload (End-to-End)

- [ ] Backend: Implement actual S3 file upload in content endpoint (replace TODO)
- [ ] Backend: Wire up Celery task for async content processing (OCR / transcription)
- [ ] Backend: Test OCR extraction (Tesseract) with real image uploads
- [ ] Backend: Test Whisper transcription with real audio uploads
- [ ] Frontend: Connect upload UI to `POST /content/upload` with multipart form data
- [ ] Frontend: Connect text input to `POST /content/text`
- [ ] Frontend: Poll or websocket for processing status updates
- [ ] Frontend: Display extracted text/concepts after processing completes

### 2.3 AI Material Generation (End-to-End)

- [ ] Backend: Wire up `POST /materials/{id}/generate` to actually call AI service
- [ ] Backend: Dispatch Celery tasks for each format (summary, flashcards, quiz, podcast)
- [ ] Backend: Test AI generation with real OpenAI API calls
- [ ] Frontend: "Generate" button on material detail page → call generate endpoint
- [ ] Frontend: Show generation progress for each format
- [ ] Frontend: Display generated summary in material detail view
- [ ] Frontend: Display generated flashcards in material detail view
- [ ] Frontend: Display generated quiz questions in material detail view

### 2.4 Dashboard Data (Live)

- [ ] Fetch and display real stats from `GET /analytics/overview`
- [ ] Fetch and display real materials list from `GET /materials`
- [ ] Calculate and display actual flashcards due from `GET /study/flashcards/due`
- [ ] Show real recent materials with actual data

---

## PHASE 3 — Core Study Features

_Goal: Users can actually learn. Flashcard review with spaced repetition,
quizzes with scoring, study sessions tracked._

### 3.1 Flashcard Review (Functional)

- [ ] Fetch due flashcards from `GET /study/flashcards/due`
- [ ] Start study session via `POST /study/sessions`
- [ ] Submit card reviews via `POST /study/flashcards/{id}/review` (SM-2 rating 0-5)
- [ ] Update card state locally after each review (optimistic UI)
- [ ] Complete session via `POST /study/sessions/{id}/complete`
- [ ] Display real session stats on completion screen

### 3.2 Quiz System (Functional)

- [ ] Fetch quiz questions from `GET /study/quiz/{material_id}`
- [ ] Submit answers via `POST /study/quiz/submit`
- [ ] Display real score and per-question results
- [ ] Track quiz as a study session

### 3.3 Study Session Tracking

- [ ] Backend: Implement study streak calculation (currently TODO)
- [ ] Backend: Implement token blocklist with Redis for logout (currently TODO)
- [ ] Track and display study minutes per session
- [ ] Display real streak count on dashboard

### 3.4 Analytics (Live Data)

- [ ] Connect analytics page charts to `GET /analytics/overview`
- [ ] Build real data for heatmap from study session history
- [ ] Build real data for study time chart from session records
- [ ] Display actual retention metrics from flashcard review history

---

## PHASE 4 — Deployment & Infrastructure

_Goal: NKOM is live on the internet. Real users can access it._

### 4.1 Backend Deployment Prep

- [ ] Create Alembic migration scripts for all models (initial migration)
- [ ] Run and verify migrations against clean Postgres
- [ ] Configure production environment variables
- [ ] Set up Sentry error tracking for backend
- [ ] Add health check endpoint monitoring
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting with Redis
- [ ] Security audit — ensure all endpoints validate auth properly

### 4.2 Frontend Deployment Prep

- [ ] Production build optimization (`next build` — fix any errors)
- [ ] Set up environment variables for production API URL
- [ ] Configure SEO meta tags (title, description, Open Graph, Twitter cards)
- [ ] Add favicon and PWA manifest
- [ ] Test all pages in production mode locally
- [ ] Performance audit — Lighthouse score optimization (target 90+)

### 4.3 Infrastructure (AWS via Terraform)

- [ ] Finalize Terraform configs — add ECS task definitions and service
- [ ] Set up RDS with production credentials (Secrets Manager)
- [ ] Configure S3 bucket policies and CORS for file uploads
- [ ] Set up CloudFront CDN for frontend
- [ ] Configure Route 53 for custom domain
- [ ] Set up SSL/TLS certificate via ACM
- [ ] Deploy Redis (ElastiCache) for sessions and rate limiting
- [ ] Set up application load balancer (ALB)

### 4.4 CI/CD Pipeline

- [ ] GitHub Actions workflow — lint + type-check + test on PR
- [ ] GitHub Actions workflow — build and push Docker images on merge to main
- [ ] GitHub Actions workflow — deploy to ECS on release tag
- [ ] Set up staging environment for pre-production testing

### 4.5 Domain & DNS

- [ ] Purchase and configure domain name
- [ ] Set up DNS records (A, CNAME, MX for email)
- [ ] Configure SSL certificate and HTTPS redirect
- [ ] Set up email (transactional — SES or similar)

---

## PHASE 5 — Polish, Growth & Business

_Goal: Production-quality experience. Start getting real users._

### 5.1 User Experience Polish

- [ ] Add loading skeletons to every page that fetches data
- [ ] Add error states with retry buttons for all API calls
- [ ] Toast notifications for all user actions (upload success, review complete, etc.)
- [ ] Keyboard shortcuts (spacebar to flip card, 1-4 for rating, etc.)
- [ ] Responsive design QA — test iPhone SE, iPhone 14, iPad, Desktop
- [ ] Accessibility audit — screen reader, keyboard navigation, ARIA labels
- [ ] Add subtle sound effects for flashcard flip and quiz correct/incorrect (optional)

### 5.2 Podcast Feature

- [ ] Backend: Generate podcast audio via TTS from podcast scripts
- [ ] Backend: Evaluate ElevenLabs integration for natural voice (currently TODO)
- [ ] Frontend: Audio player component in material detail view
- [ ] Frontend: Podcast playback with speed controls and progress tracking
- [ ] Track podcast listening as study session

### 5.3 Advanced AI Features

- [ ] Smart study recommendations ("You should review Biology today")
- [ ] Adaptive difficulty — adjust flashcard/quiz difficulty based on performance
- [ ] AI-generated mnemonics with visual associations
- [ ] Multi-language support for content extraction and generation

### 5.4 Subscription & Monetization

- [ ] Integrate Stripe for payment processing
- [ ] Implement subscription tiers (Free: 3 materials/month, Student: 25, Pro: unlimited)
- [ ] Usage tracking and limit enforcement per tier
- [ ] Subscription management page (upgrade, downgrade, cancel)
- [ ] Family plan — shared account with individual progress tracking

### 5.5 Social & Sharing

- [ ] Public share link for study materials
- [ ] Study group feature — share materials with a group
- [ ] Leaderboard among friends (optional, gamification)
- [ ] Export flashcards to Anki format

### 5.6 Marketing & Launch

- [ ] Create landing page copy that converts (A/B test headlines)
- [ ] Set up analytics (Mixpanel or PostHog) for user behavior tracking
- [ ] Create demo video / walkthrough
- [ ] Prepare Product Hunt launch
- [ ] Set up feedback collection (in-app feedback widget)
- [ ] Social media presence (Instagram, TikTok — study tips content)

---

## Backlog — Future Ideas

_Not prioritized yet. Move items up when the time comes._

- [ ] Mobile app (React Native or Expo, reuse components)
- [ ] Offline mode with local storage sync
- [ ] Handwriting recognition (AWS Textract integration — currently TODO)
- [ ] Calendar integration (Google Calendar study reminders)
- [ ] Instructor/professor mode — create materials for a class
- [ ] LMS integration (Canvas, Blackboard, Moodle export)
- [ ] Collaboration — real-time shared study sessions
- [ ] Gamification — XP, levels, badges, achievements
- [ ] Browser extension — clip web content directly into NKOM
- [ ] API for third-party integrations

---

## Current Status Snapshot

| Area | Status |
|------|--------|
| Backend API | Core endpoints built, 23 routes, needs S3/Celery wiring |
| Database Models | 6 models defined, migrations not yet generated |
| AI Services | OpenAI integration coded, needs real-world testing |
| Frontend Pages | Landing, Auth, Dashboard exist but basic |
| Components Library | **Not started** — this is where Phase 0 begins |
| Deployment | Terraform + Docker configs exist, not deployed |
| Tests | Basic health + auth tests only |

---

_Last updated: 2026-02-11_
