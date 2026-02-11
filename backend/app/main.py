"""NKOM API — AI-Powered Personalized Learning Platform."""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifecycle."""
    setup_logging()
    # TODO: Initialize DB connection pool
    # TODO: Initialize Redis connection
    # TODO: Warm up AI service clients
    yield
    # Shutdown: close connections
    # TODO: Close DB pool
    # TODO: Close Redis


def create_app() -> FastAPI:
    """Application factory — creates and configures the FastAPI app."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="AI-Powered Personalized Learning Platform API",
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        docs_url=f"{settings.API_V1_PREFIX}/docs",
        redoc_url=f"{settings.API_V1_PREFIX}/redoc",
        lifespan=lifespan,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # API routes
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # Health check (outside versioned API)
    @app.get("/health", tags=["system"])
    async def health_check() -> dict[str, str]:
        return {"status": "healthy", "service": "nkom-api"}

    return app


app = create_app()
