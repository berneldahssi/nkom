"""Shared FastAPI dependencies — Cognito auth, rate limiting, etc."""

import structlog
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import httpx

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

logger = structlog.get_logger()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=True,
)

# In-memory JWKS cache — refreshed when a key isn't found
_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(settings.cognito_jwks_uri)
            r.raise_for_status()
            _jwks_cache = r.json()
    return _jwks_cache


async def _verify_cognito_token(token: str) -> dict:
    """Validate a Cognito access token and return its claims."""
    global _jwks_cache

    try:
        header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token header")

    jwks = await _get_jwks()
    key = next((k for k in jwks.get("keys", []) if k.get("kid") == header.get("kid")), None)

    if key is None:
        _jwks_cache = None
        jwks = await _get_jwks()
        key = next((k for k in jwks.get("keys", []) if k.get("kid") == header.get("kid")), None)

    if key is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Signing key not found")

    try:
        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False},  # Cognito access tokens use client_id, not aud
            issuer=settings.cognito_issuer,
        )
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {exc}",
        )

    if claims.get("client_id") != settings.COGNITO_CLIENT_ID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid client")

    if claims.get("token_use") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not an access token")

    return claims


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Validate Cognito access token and return (or auto-create) the DB user."""
    claims = await _verify_cognito_token(token)
    cognito_sub: str | None = claims.get("sub")
    if not cognito_sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing sub claim")

    result = await db.execute(select(User).where(User.cognito_sub == cognito_sub))
    user = result.scalar_one_or_none()

    if user is None:
        username: str = claims.get("username") or claims.get("cognito:username") or ""
        email = username if "@" in username else f"{cognito_sub}@nkom.local"
        user = User(
            cognito_sub=cognito_sub,
            email=email,
            subscription_tier="free",
        )
        db.add(user)
        try:
            await db.flush()
            await db.commit()
        except Exception:
            await db.rollback()
            result = await db.execute(select(User).where(User.cognito_sub == cognito_sub))
            user = result.scalar_one_or_none()
            if user is None:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User creation failed")

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive account")
    return current_user


async def get_premium_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if not current_user.is_premium:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Premium subscription required")
    return current_user
