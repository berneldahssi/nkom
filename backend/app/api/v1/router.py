"""Central API router — registers all v1 endpoint groups."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, content, materials, study, users, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(materials.router, prefix="/materials", tags=["materials"])
api_router.include_router(study.router, prefix="/study", tags=["study"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
