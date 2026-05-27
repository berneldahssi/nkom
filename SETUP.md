# NKOM MVP Setup Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Claude API key from https://console.anthropic.com/

## Quick Start (5 minutes)

### 1. Start Database & Redis
```bash
docker-compose up -d
```

Wait for health checks to pass:
```bash
docker-compose ps
# Both services should show "healthy"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -e .

# Run Alembic migration (create tables)
alembic upgrade head

# Add your Claude API key to .env
# ANTHROPIC_API_KEY=sk-ant-xxxxx

# Start backend
uvicorn app.main:app --reload --port 8000
```

Backend runs on: **http://localhost:8000**
- API docs: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## Testing the MVP Flow

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nkom.com",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "country": "Cameroon"
  }'
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. Upload Text Content
```bash
curl -X POST http://localhost:8000/api/v1/content/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@notes.txt" \
  -F "file_type=text"
```

### 3. Generate Summary
```bash
# Get content_id from upload response
# Then create a material and generate

curl -X POST http://localhost:8000/api/v1/materials \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "CONTENT_ID_HERE",
    "title": "Biology Notes",
    "subject": "Biology",
    "source_type": "lecture_notes"
  }'

# Then generate summary
curl -X POST http://localhost:8000/api/v1/materials/MATERIAL_ID/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format": "summary"}'
```

---

## Environment Variables

### Backend (.env)
- `ANTHROPIC_API_KEY`: Your Claude API key (required for summaries)
- `SECRET_KEY`: JWT signing key (change in production!)
- Database credentials (pre-configured for Docker)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend URL (default: http://localhost:8000)

---

## Troubleshooting

### PostgreSQL Connection Error
```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Claude API Errors
- Make sure `ANTHROPIC_API_KEY` is set in `backend/.env`
- Test key: `curl https://api.anthropic.com/v1/messages -H "x-api-key: YOUR_KEY"`

### Frontend Can't Connect to Backend
- Check `frontend/.env.local` has correct `NEXT_PUBLIC_API_URL`
- Ensure backend is running on port 8000
- Check CORS settings in `backend/app/core/config.py`

---

## Next Steps

1. ✅ Test auth flow in browser
2. ✅ Test upload via dashboard
3. ✅ Verify summaries generate with Claude
4. 🚀 Deploy to staging
5. 🚀 Add Whisper for audio transcription

---

## Useful Commands

```bash
# View database
docker exec -it nkom_postgres psql -U nkom -d nkom

# View logs
docker-compose logs -f postgres

# Stop everything
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```
