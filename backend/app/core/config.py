"""Application configuration — loads from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────
    PROJECT_NAME: str = "NKOM"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development | staging | production
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION"

    # ── CORS ─────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://nkom.vercel.app",
    ]
    # Comma-separated override from env (e.g. ALLOWED_ORIGINS=https://nkom.vercel.app,http://localhost:3000)
    ALLOWED_ORIGINS: str = ""

    @property
    def cors_origins(self) -> list[str]:
        if self.ALLOWED_ORIGINS:
            return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
        return self.CORS_ORIGINS

    # ── Database ─────────────────────────────────────────────────
    POSTGRES_USER: str = "nkom"
    POSTGRES_PASSWORD: str = "nkom_dev_password"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "nkom"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def database_url_sync(self) -> str:
        """Sync URL for Alembic migrations."""
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # ── Redis ────────────────────────────────────────────────────
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    @property
    def redis_url(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # ── JWT / Auth ───────────────────────────────────────────────
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Cognito ──────────────────────────────────────────────────
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""
    COGNITO_REGION: str = ""  # falls back to AWS_REGION when empty
    COGNITO_JWKS_URI: str = ""  # explicit override; auto-derived if empty

    @property
    def cognito_enabled(self) -> bool:
        return bool(self.COGNITO_USER_POOL_ID and self.COGNITO_CLIENT_ID)

    @property
    def _cognito_region(self) -> str:
        return self.COGNITO_REGION or self.AWS_REGION

    @property
    def cognito_issuer(self) -> str:
        return f"https://cognito-idp.{self._cognito_region}.amazonaws.com/{self.COGNITO_USER_POOL_ID}"

    @property
    def cognito_jwks_uri(self) -> str:
        return self.COGNITO_JWKS_URI or f"{self.cognito_issuer}/.well-known/jwks.json"

    # ── AWS ──────────────────────────────────────────────────────
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    S3_BUCKET_UPLOADS: str = "nkom-user-uploads"

    # ── AI Services ──────────────────────────────────────────────
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo"

    # ── Rate Limiting ────────────────────────────────────────────
    RATE_LIMIT_FREE: int = 100   # requests per minute
    RATE_LIMIT_PREMIUM: int = 1000

    # ── Sentry ───────────────────────────────────────────────────
    SENTRY_DSN: str = ""


settings = Settings()
