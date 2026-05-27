# NKOM Instant Recording Feature
## Complete Technical Specification

**Status:** MVP-Priority Feature
**Version:** 1.0
**Created:** February 15, 2026
**Priority:** P0 (Ship with initial MVP)

---

## EXECUTIVE SUMMARY

NKOM's key differentiator is the **seamless recording → transcription → AI generation pipeline**. Users record their class/study session with one tap, and the platform automatically transforms it into personalized study materials (podcast, flashcards, quiz, summary, manga, memory palace, practice problems).

This feature is **simpler to execute than manual upload** while being **more valuable to users**, making it a strategic MVP inclusion.

---

## 1. USER NEED & VALIDATION

### The Problem We're Solving
- **For students:** Taking photos of notes is tedious, error-prone, incomplete
- **For lectures:** Can't capture entire lecture in photos → missing context
- **For diaspora:** Parents want to record their child's study sessions to review later
- **For accessibility:** Blind/low-vision students can't photograph notes effectively

### Why Recording > Manual Upload
| Aspect | Photo Upload | Audio Recording |
|--------|--------------|-----------------|
| **Speed** | 30 sec/page | Continuous, just press record |
| **Completeness** | Misses details | Captures full lecture |
| **Setup** | Good lighting, clear angle needed | Works anywhere |
| **for accessibility** | Requires sight | Works for all |
| **Exam prep** | Can't capture teacher explanations | Gets teacher's exact wording |

### Market Validation
- 78% of students use voice notes already (WhatsApp, Notes app)
- 65% prefer recording to typing during lectures
- Recording-first platforms (Otter, Apple Voice Memos) are widely adopted

---

## 2. FEATURE SCOPE

### What's Included (MVP)

#### 2.1 Recording Capabilities
```
Recording Duration:    Up to 2 hours continuous
Supported Formats:     MP3, M4A (AAC), WAV
Audio Quality:         128 kbps - 320 kbps (user configurable)
Sample Rate:          16 kHz - 48 kHz (auto-detect device capability)
Mono/Stereo:          Mono (smaller file) or Stereo (better quality)
Backup Storage:       Local device + AWS S3 (configurable)
```

#### 2.2 Recording Interface
```
Primary Interface:
  ┌─────────────────────────┐
  │  NKOM Main Dashboard    │
  ├─────────────────────────┤
  │                         │
  │ [🎤 Record Class]       │ ← Prominent button
  │ [📁 Upload Material]    │
  │ [📚 My Materials]       │
  │                         │
  └─────────────────────────┘

Recording Screen:
  ┌─────────────────────────┐
  │  Recording: 24:35       │ ← Timer
  │  [🎙️ ||||||||||||]      │ ← Waveform visualization
  │                         │
  │  File Size: 45 MB       │
  │  Battery: 87%           │
  │                         │
  │  [⏸ Pause]  [🛑 Stop]  │
  │                         │
  └─────────────────────────┘
```

#### 2.3 Post-Recording Options
```
After user taps "Stop Recording":

┌─────────────────────────────────────┐
│  Recording Saved (45 MB)            │
├─────────────────────────────────────┤
│                                     │
│  [✏️ Edit Recording]                │
│    • Trim start/end                 │
│    • Mark sections (00:00 - 15:30)  │
│    • Add notes on timeline          │
│                                     │
│  [🚀 Generate Materials Now]        │
│    → Go to context form             │
│                                     │
│  [⏱️ Upload Later]                  │
│    → Background upload when WiFi    │
│    → Generate when you open app     │
│                                     │
│  [🔐 Save Locally Only]             │
│    → No cloud backup (privacy opt)  │
│                                     │
└─────────────────────────────────────┘
```

### What's Excluded (Phase 2+)
- Real-time transcription (too battery/network intensive for MVP)
- Speaker diarization ("who said what")
- Multi-speaker recognition
- Noise cancellation (can add post-MVP)
- Editing within audio (complex UX)

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Frontend (React Native)

#### Dependencies
```json
{
  "react-native-audio-recorder-player": "^6.5.0",
  "react-native-permissions": "^3.8.0",
  "react-native-document-picker": "^9.0.0",
  "react-native-fs": "^2.20.0",
  "react-native-progress": "^5.0.0"
}
```

#### Core Components

**RecordingScreen.tsx**
```typescript
interface RecordingState {
  isRecording: boolean;
  duration: number;  // in seconds
  fileSize: number;  // in bytes
  filePath: string;
  waveformData: number[];  // for visualization
  error?: string;
}

interface RecordingConfig {
  audioFormat: 'mp3' | 'm4a' | 'wav';
  sampleRate: 16000 | 44100 | 48000;
  bitRate: 128000 | 192000 | 256000 | 320000;
  channels: 1 | 2;  // mono or stereo
  quality: 'low' | 'medium' | 'high';
}

const RecordingScreen: React.FC = () => {
  // Start recording with permission checks
  const startRecording = async () => {
    // 1. Request microphone permission
    // 2. Initialize audio recorder with config
    // 3. Update UI with recording state
    // 4. Capture waveform data for visualization
  };

  // Stop recording and get file info
  const stopRecording = async () => {
    // 1. Stop audio recorder
    // 2. Get file size, duration
    // 3. Move to temp storage
    // 4. Show post-recording options
  };

  // Pause/resume for longer sessions
  const pauseRecording = async () => {
    // Store current position
    // Pause without stopping
  };
};
```

#### Microphone Permission Flow
```typescript
// ios/Info.plist
<key>NSMicrophoneUsageDescription</key>
<string>NKOM records your lectures to create personalized study materials.
         We don't share recordings without your consent.</string>

// android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

#### Storage Management
```typescript
// Local device storage
const recordingPath = `${RNFS.DocumentDirectoryPath}/recordings/${timestamp}.m4a`;

// File lifecycle:
// 1. Save to device immediately (temp)
// 2. If user generates materials: keep + upload
// 3. If user discards: delete after 7 days
// 4. Cloud: async upload when WiFi available
// 5. Cleanup: Delete local after confirmed cloud backup
```

### 3.2 Backend (FastAPI)

#### New API Endpoints

**Upload Recording**
```python
POST /api/v1/uploads/recording
Content-Type: multipart/form-data

Params:
  file: audio file (mp3, m4a, wav)
  title: str (e.g., "Biology Lecture 5")
  subject: str (e.g., "Cell Biology")
  description: optional str

Response:
{
  "id": "uuid",
  "status": "processing",
  "estimated_time": 45,  # seconds
  "transcription_job_id": "whisper_job_123"
}
```

**Check Transcription Status**
```python
GET /api/v1/uploads/recording/{id}/status

Response:
{
  "id": "uuid",
  "status": "completed" | "processing" | "failed",
  "transcribed_text": "...",
  "duration": 1425,  # seconds
  "file_size": 45000000  # bytes
}
```

### 3.3 AI Pipeline

#### Whisper Transcription
```python
# Async job queue (Celery/Bull)

async def transcribe_recording(file_id: str):
    """
    1. Get file from S3
    2. Call OpenAI Whisper API
    3. Store transcription in DB
    4. Trigger content generation
    5. Notify user when ready
    """

    file_url = await get_s3_url(file_id)
    transcription = await whisper_service.transcribe(
        audio_url=file_url,
        language="en",  # or detect from user profile
        response_format="verbose_json"  # includes timestamps
    )

    await store_transcription(file_id, transcription)
    await generate_study_materials(file_id, transcription)
```

#### Material Generation (Same as Upload)
```python
async def generate_study_materials(file_id: str, transcribed_text: str):
    """
    Generates all 7 formats from transcribed text.
    (See Feature 2: AI Content Transformation in master blueprint)
    """

    # Get user context
    user = await get_user(file_id)

    # Generate materials using context-aware prompts
    materials = {
        "summary": await generate_summary(transcribed_text, user),
        "flashcards": await generate_flashcards(transcribed_text, user),
        "quiz": await generate_quiz(transcribed_text, user),
        "podcast": await generate_podcast(transcribed_text, user),
        "manga": await generate_manga(transcribed_text, user),
        "memory_palace": await generate_palace(transcribed_text, user),
        "practice_problems": await generate_problems(transcribed_text, user),
    }

    return materials
```

---

## 4. IMPLEMENTATION PLAN

### Phase 1: Core Recording (Week 1)
- [ ] Set up React Native audio recorder
- [ ] Implement recording UI (start, stop, pause)
- [ ] Add microphone permission handling
- [ ] Test on iOS and Android devices
- [ ] Implement local file storage
- [ ] Create post-recording screen

**Deliverable:** Can record up to 2 hours, save locally, pause/resume

### Phase 2: Cloud Upload (Week 2)
- [ ] Set up AWS S3 bucket for recordings
- [ ] Implement background upload service
- [ ] Add upload progress indicator
- [ ] Implement retry logic (network failures)
- [ ] Create upload management in storage
- [ ] Add manual trigger for immediate upload

**Deliverable:** Recordings sync to cloud automatically

### Phase 3: Transcription Integration (Week 2-3)
- [ ] Integrate OpenAI Whisper API
- [ ] Implement async transcription job queue
- [ ] Create transcription status endpoint
- [ ] Add notification when transcription complete
- [ ] Handle transcription errors gracefully
- [ ] Store transcriptions in database

**Deliverable:** Audio files automatically transcribed

### Phase 4: Material Generation (Week 3)
- [ ] Modify content generation pipeline to accept transcribed text
- [ ] Test with various audio lengths (5 min, 30 min, 2 hours)
- [ ] Implement context-aware prompt engineering
- [ ] Add fallback for failed transcriptions
- [ ] Create user feedback loop for transcription quality

**Deliverable:** Recordings generate complete study materials

### Phase 5: Polish & Optimization (Week 4)
- [ ] Battery consumption optimization
- [ ] Audio quality settings (low/medium/high)
- [ ] File size optimization
- [ ] UX polish and animations
- [ ] Error handling and user messaging
- [ ] Beta testing with 20 real users

**Deliverable:** MVP-ready recording feature

---

## 5. COST ANALYSIS

### Per-Recording Costs (at scale)

| Component | Cost per Recording |
|-----------|-------------------|
| S3 Storage (1 hour recording ~50MB) | $0.001 |
| Whisper API transcription | $0.006 (1 hour) |
| GPT-4 content generation | $0.05 - $0.15 (7 formats) |
| ElevenLabs TTS (podcast) | $0.003 |
| **Total per recording** | **$0.06 - $0.16** |

### Monthly Operating Cost (at 10K users)
```
Assumptions:
- 10,000 users
- 20% record at least 1 class/week
- 2,000 recordings/week = 8,000/month

Monthly costs:
- Whisper: $48
- GPT-4: $400 - $1,200
- TTS: $24
- Storage: $32
- Total: $500 - $1,300/month

Per-user cost: $0.05 - $0.13/user/month
(vs. $8-15/month student subscription → 66-96% gross margin)
```

---

## 6. USER PRIVACY & CONSENT

### Recording Consent Flow
```
First time user taps "Record":

┌──────────────────────────────────┐
│ Privacy & Permissions             │
├──────────────────────────────────┤
│                                  │
│ We'll record your microphone      │
│ to capture lectures and classes.  │
│                                  │
│ Your recordings are:              │
│ ✅ Encrypted in transit          │
│ ✅ Encrypted at rest             │
│ ✅ Only you can access           │
│ ✅ Deleted after 90 days         │
│   (unless you keep them)          │
│                                  │
│ We never share without consent.   │
│                                  │
│ [✓ I understand] [Learn more]    │
│                                  │
└──────────────────────────────────┘
```

### Data Handling
- **Transcriptions** — Temporarily stored during processing, then deleted from Whisper
- **Generated Materials** — Permanently stored (user can delete)
- **Recordings** — User can delete anytime, auto-deleted after 90 days if not touched
- **Privacy** — Users can opt "save locally only" (no cloud backup)

---

## 7. SUCCESS METRICS

### Technical Metrics
- Recording starts within 1 second of tap
- <200MB per hour of audio
- Transcription completes within 2x duration (1-hour recording done in 2 hours)
- >95% transcription accuracy for clear audio
- <5% failure rate

### Product Metrics
- >60% of users try recording feature
- >40% use it as primary input method (vs. photo upload)
- 4.5+ star rating on recording feature
- <2% "transcription quality" complaints

### Business Metrics
- Recording features improves retention by 15%
- Increases daily active usage (more sessions)
- Reduces support costs (less "I can't photograph my notes" tickets)

---

## 8. Risks & Mitigation

### Risk 1: Battery Drain
**Impact:** Users stop using if battery drains quickly
**Mitigation:**
- Optimize audio codec (AAC/M4A vs. WAV)
- Default to mono (not stereo)
- Allow users to lower sample rate
- Show battery percentage during recording
- Warn if <20% battery

### Risk 2: Storage Limits
**Impact:** Users on small phones can't record long lectures
**Mitigation:**
- Compress audio during recording
- Auto-upload to cloud (frees local storage)
- Warn if <500MB available
- Allow cloud-only storage (no local backup)

### Risk 3: Poor Transcription Quality
**Impact:** Generated materials inaccurate if transcription wrong
**Mitigation:**
- Show transcription to user before generating
- Allow user to edit transcript
- Track transcription accuracy per audio quality
- Fallback to manual upload if transcription fails
- Show confidence scores

### Risk 4: Privacy Concerns
**Impact:** Users nervous about recording everything
**Mitigation:**
- Clear privacy policy in UI
- "Save locally only" option
- Auto-delete after 90 days (if not touched)
- Show user what's being uploaded
- Transparent about where data goes

### Risk 5: Microphone Permission Denial
**Impact:** Users deny permission, can't record
**Mitigation:**
- Explain why we need microphone (in permission dialog)
- Provide fallback to photo upload
- Offer to re-request permission later
- Show education modal on first use

---

## 9. ACCEPTANCE CRITERIA

### For Development Team
- [ ] Can record up to 2 hours continuously
- [ ] Supports MP3, M4A, WAV formats
- [ ] Automatic cloud upload (no user action needed)
- [ ] Whisper transcription works end-to-end
- [ ] Generated materials match upload quality
- [ ] All permission flows working (iOS + Android)
- [ ] <5 second startup time
- [ ] Error handling for network failures
- [ ] Tests cover all edge cases

### For Product Owner
- [ ] Recording is simpler than photo upload
- [ ] First-time users can record without help
- [ ] Materials generated from recording match upload quality
- [ ] No privacy/security issues
- [ ] Battery impact <5% per hour recording
- [ ] Users report this feature as "game-changer"

### For Project Manager
- [ ] Delivered in Week 4 of MVP (on time)
- [ ] No scope creep (excluded Phase 2 features)
- [ ] Costs <$1,300/month at 10K users
- [ ] Beta tested with 20 real users
- [ ] User feedback overwhelmingly positive

---

## 10. FUTURE ENHANCEMENTS (Phase 2+)

### Advanced Recording Features
- Real-time waveform visualization during recording
- Noise cancellation (built-in or post-processing)
- Speaker diarization ("who said what")
- Bookmark important sections during class
- In-recording note-taking (timestamps)
- Multi-file stitching (combine multiple recordings)

### Transcription Improvements
- Real-time transcription with live updates
- Custom vocabulary for domain-specific terms
- Timestamps for every sentence
- Speaker identification
- Emotion/tone detection

### Playback & Review
- Transcript playback (text + audio sync)
- Seek to important moments
- Export transcript as PDF
- Share recordings with study group
- Collaborative transcription editing

---

**This feature transforms NKOM from a "notes input tool" into a "lecture capture platform"** — capturing the student's entire learning experience, not just static notes.

It's simpler to execute, more valuable to users, and creates a competitive moat vs. generic AI tools.
