# NKOM — AI-Powered Personalized Learning Platform

> **Own What You Know.** Upload your notes, photos, or audio — NKOM transforms them into personalized learning experiences powered by AI and neuroscience.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2, Alembic |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Database** | PostgreSQL 15, Redis 7 |
| **AI** | OpenAI GPT-4, Whisper, Tesseract OCR |
| **Infra** | Docker, AWS (ECS, RDS, S3), Terraform |
| **CI/CD** | GitHub Actions |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- (Optional) Python 3.11+ and Node.js 20+ for local dev

### 1. Clone & configure

```bash
git clone https://github.com/your-org/nkom.git
cd nkom
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit .env files with your API keys
```

### 2. Start with Docker

```bash
docker compose up -d
```

- **API:** http://localhost:8000/api/v1/docs
- **Frontend:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### 3. Run migrations

```bash
docker compose exec api alembic upgrade head
```

### 4. Run tests

```bash
# Backend
docker compose exec api pytest -v

# Frontend
docker compose exec web npm run lint && npm run type-check
```

## Project Structure

```
nkom/
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/v1/    # API routes (auth, users, content, study, analytics)
│   │   ├── core/      # Config, security, database, dependencies
│   │   ├── models/    # SQLAlchemy ORM models
│   │   ├── schemas/   # Pydantic request/response schemas
│   │   └── services/  # Business logic (AI, OCR, speech)
│   ├── alembic/       # Database migrations
│   └── tests/         # Pytest test suite
├── frontend/          # Next.js 14 application
│   └── src/
│       ├── app/       # App Router pages (auth, dashboard)
│       ├── components/ # Reusable UI components
│       ├── services/  # API client
│       └── types/     # TypeScript type definitions
├── infrastructure/    # Terraform IaC
├── .github/           # CI/CD workflows, issue templates
├── docker-compose.yml # Local development stack
└── README.md
```

## API Endpoints

| Group | Endpoints |
|-------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` |
| **Users** | `GET /users/me`, `PUT /users/me`, `PUT /users/me/learning-style` |
| **Content** | `POST /content/upload`, `POST /content/text`, `GET /content/:id` |
| **Materials** | `POST /materials`, `GET /materials`, `POST /materials/:id/generate` |
| **Study** | `GET /study/sessions`, `POST /study/flashcards/:id/review`, `POST /study/quiz/submit` |
| **Analytics** | `GET /analytics/overview` |

Full interactive docs at `/api/v1/docs` when the server is running.

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Open a PR against `develop`
4. Ensure CI passes

## License

MIT
