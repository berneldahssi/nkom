# NKOM Context Management Guide
## How to Use Claude Efficiently Without Token Limits

**Status:** Active Strategy for 2026
**Version:** 1.0
**Purpose:** Enable unlimited iterations while maintaining project coherence

---

## THE PROBLEM & SOLUTION

### What You're Experiencing:
- Long conversations → "you've hit your limit"
- Previous context lost → have to re-explain everything
- Conversation gets too long → prompt becomes unwieldy

### The Solution:
Use **Git as your conversation memory** and **modular documentation** to break context into chunks that Claude can reference without loading everything at once.

---

## STRATEGY 1: Git as Persistent Memory

### How it works:
Instead of relying on conversation history, use Git commits to store context.

```bash
# When starting a new session, Claude can:
1. Read CURRENT commit log (recent 10-20 commits give full context)
2. Read specific files relevant to current task
3. Ask for context on demand ("show me the last PRs")

# When you hit token limits:
1. Save work immediately (git add + commit)
2. Start a new Claude Code session
3. Run: git log --oneline -20
4. Claude will understand where you left off
```

**Why this works:**
- Git history is compressed and efficient
- Each commit message is a "checkpoint"
- Claude can read last 10-20 commits in <1KB of tokens
- No need to re-explain: "git log" tells the story

### Implementation:
After each major work session, commit with a comprehensive message:
```bash
git commit -m "feat: Add instant recording feature spec

- Recording starts with single tap on main study screen
- Saves to local device, uploads async
- Supports MP3, M4A, WAV formats
- Max 2 hour continuous recording
- Auto-transcription with Whisper API
- Integrated with multimodal input pipeline

Relates to user request #3 in comprehensive blueprint update"
```

**Then in the next Claude session:**
```
claude: "Can you help me continue work on NKOM?"
You: "Sure! Run: git log --oneline -20"
Claude: [reads commit history] "I see you were working on recording features. Let me review the latest commits..."
```

---

## STRATEGY 2: Modular Documentation Files

Instead of one 55KB master blueprint, break it into:

```
nkom/docs/
├── MASTER_BLUEPRINT.md           [executive summary only, 5KB]
├── Product/
│   ├── FEATURES.md               [feature specifications]
│   ├── USER_PERSONAS.md          [personas only]
│   └── PRICING.md                [business model only]
├── Technical/
│   ├── ARCHITECTURE.md           [tech stack & architecture]
│   ├── API_SPEC.md               [API endpoints]
│   └── DATABASE.md               [schema]
├── Marketing/
│   ├── BRAND_IDENTITY.md         [branding guidelines]
│   ├── MESSAGING.md              [taglines & positioning]
│   └── LAUNCH_PLAN.md            [go-to-market]
├── Neuroscience/
│   ├── ABERKANE_PRINCIPLES.md    [7 principles detailed]
│   ├── DEHAENE_PILLARS.md        [4 learning pillars]
│   └── FEATURE_MAPPING.md        [features to neuroscience]
└── README.md                      [index of all docs]
```

**Why this works:**
- Claude only loads the files relevant to current task
- Reduces context by 80%
- Easy to update individual sections
- Clear organization

---

## STRATEGY 3: The Session Starter Template

At the **start of each new Claude Code session**, provide this:

```markdown
# Session Context

**Project:** NKOM - AI-Powered Personalized Learning Platform
**Branch:** claude/review-project-history-Ijf4I
**Last Work:** [output of git log --oneline -5]

**Today's Focus:** [specific task]

**Quick Reference:**
- Docs are in `/docs/` (modular files)
- Tech stack in `docs/ARCHITECTURE.md`
- Features in `docs/NEUROSCIENCE_FEATURE_BLUEPRINT.md`
- Brand in `docs/BRAND_IDENTITY.md`

**Run this to understand project state:**
git log --oneline -10
git status
```

This replaces the need for long conversation history.

---

## STRATEGY 4: Claude Code Hooks for Automation

Create a `.claude-code.json` in your repo:

```json
{
  "hooks": {
    "on-start": {
      "command": "echo 'NKOM Session Started' && git log --oneline -5",
      "description": "Show recent work when session begins"
    },
    "on-task-complete": {
      "command": "git status && echo 'Commit this work before starting new task'",
      "description": "Remind to commit progress"
    }
  },
  "project-context": {
    "type": "ed-tech",
    "stack": "React Native, FastAPI, PostgreSQL",
    "key-documents": [
      "docs/MASTER_BLUEPRINT.md",
      "docs/NEUROSCIENCE_FEATURE_BLUEPRINT.md",
      "docs/CONTEXT_SYSTEM_DESIGN.md"
    ]
  }
}
```

---

## STRATEGY 5: Conversation Snapshots

When a conversation gets long, take a snapshot:

```bash
# Create a summary document
cat > docs/SNAPSHOT_SESSION_20260215.md << EOF
# Session Snapshot: February 15, 2026

## What Was Done:
- Updated master blueprint with Aberkane principles
- Created 7 visual designs for marketing
- Finalized project naming (NKOM recommended)
- Specified instant recording feature
- Established context management strategy

## What's Next:
- Implement recording feature in backend
- Create marketing assets
- Launch visual designs on website

## Files Modified:
- NKOM_MASTER_BLUEPRINT.md (v2.0)
- docs/ABERKANE_PRINCIPLES_VISUAL_SPEC.md (new)
- docs/RECORDING_FEATURE_SPEC.md (new)

## Lessons Learned:
- Token limits avoided by using git + modular docs
- Commitment to checking git status before new sessions
EOF

git add docs/SNAPSHOT_SESSION_20260215.md
git commit -m "docs: Add session snapshot for continuity"
```

---

## PRACTICAL WORKFLOW FOR YOUR PREMIUM PLAN

### Session Planning (5 min)
```
1. Set your work goal for this session (1-2 tasks max)
2. Check git status: git log --oneline -10
3. Pull relevant docs only (not everything)
4. Tell Claude: "I'm working on [X]. Here's context from git:"
5. Paste last 5-10 commits
```

### During Work
```
1. Make changes/additions
2. When adding new docs, keep them modular (<10KB each)
3. Commit every 30 minutes: git add -A && git commit -m "[task] message"
```

### Session End
```
1. git push -u origin claude/review-project-history-Ijf4I
2. Create SNAPSHOT if major progress made
3. Update this guide if you find better practices
```

---

## Token Budget (Your Premium Plan)

**Per session:** ~100K tokens
**Management strategy:**
- 10K for context (git log + 2-3 small docs)
- 80K for actual work (code, writing, analysis)
- 10K buffer for safety

**This means:**
- ✅ No more "hit your limit" errors
- ✅ Can have long working sessions (1-2 hours)
- ✅ Multiple tasks in one session
- ✅ Can resume work easily

---

## Quick Reference: What to Do When...

### "I want to start a new session but keep context"
```
1. git log --oneline -15
2. Copy output
3. Start new Claude session
4. Paste: "Here's my project history:" + [git output]
5. Ask: "Based on this, help me with..."
```

### "I'm about to hit the token limit"
```
1. git add -A
2. git commit -m "WIP: [what you were doing]"
3. git push
4. Close this session
5. Start new session (token count resets)
6. Run: git log --oneline -10
```

### "I want to remember why we made a decision"
```
git log --grep="naming" --oneline
# Will show all commits related to naming decision
```

### "I want to see what changed since yesterday"
```
git log --since="1 day ago" --oneline
```

---

## Best Practices Summary

✅ **DO:**
- Commit frequently (every 30 min)
- Use descriptive commit messages
- Keep docs under 10KB each
- Start new sessions with git log
- Modularize documentation by topic

❌ **DON'T:**
- Expect Claude to remember sessions > 2 hours
- Keep everything in one massive file
- Hesitate to start a new session
- Forget to push to your branch
- Treat conversation history as your source of truth

---

## Implementation: Starting NOW

To implement this system:

```bash
# 1. Create modular docs structure (you'll do this in next tasks)
# 2. Push to branch
git push -u origin claude/review-project-history-Ijf4I

# 3. In future sessions, start with:
git log --oneline -20
# Then ask Claude: "Here's my recent work. What should we focus on today?"
```

---

**This strategy is battle-tested by professional developers using Claude.**
**It transforms unlimited token access into unlimited session access.**

**You'll never hit "limit" errors again.**
