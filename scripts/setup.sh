#!/usr/bin/env bash
# Quick setup script for local development.
set -euo pipefail

echo "🔧 Setting up NKOM development environment..."

# Backend
echo "📦 Setting up backend..."
cd backend
cp -n .env.example .env 2>/dev/null || true
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cd ..

# Frontend
echo "📦 Setting up frontend..."
cd frontend
cp -n .env.example .env.local 2>/dev/null || true
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit backend/.env with your API keys"
echo "  2. Edit frontend/.env.local"
echo "  3. Run: docker compose up -d    (starts Postgres + Redis)"
echo "  4. Run: cd backend && alembic upgrade head"
echo "  5. Run: cd backend && uvicorn app.main:app --reload"
echo "  6. Run: cd frontend && npm run dev"
