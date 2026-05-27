"""Shared FastAPI dependencies — auth, rate limiting, etc."""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login"
)

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def _get_user_cognito(token: str, db: AsyncSession) -> User:
    """Verify a Cognito JWT and return (or auto-create) the local user row."""
    from app.core.cognito import verify_cognito_token  # lazy import avoids startup cost when disabled

    try:
        claims = await verify_cognito_token(token)
    except ValueError:
        raise _UNAUTHORIZED

    cognito_sub: str = claims["sub"]
    result = await db.execute(select(User).where(User.cognito_sub == cognito_sub))
    user = result.scalar_one_or_none()

    if user is None:
        # First login — provision a local record from Cognito claims
        email: str = claims.get("email", f"{cognito_sub}@cognito.local")
        user = User(
            cognito_sub=cognito_sub,
            email=email,
            first_name=claims.get("given_name"),
            last_name=claims.get("family_name"),
            subscription_tier="free",
        )
        db.add(user)
        await db.flush()

    return user


async def _get_user_legacy(token: str, db: AsyncSession) -> User:
    """Verify a locally-issued HS256 JWT — dev fallback when Cognito is not configured."""
    try:
        payload = decode_token(token)
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")
        if user_id is None or token_type != "access":
            raise _UNAUTHORIZED
    except JWTError:
        raise _UNAUTHORIZED

    user = await db.get(User, user_id)
    if user is None:
        raise _UNAUTHORIZED
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Resolve the current user from either a Cognito RS256 JWT or a local HS256 token."""
    if settings.cognito_enabled:
        return await _get_user_cognito(token, db)
    return await _get_user_legacy(token, db)


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure the current user's account is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive account",
        )
    return current_user


async def get_premium_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Ensure the current user has an active premium subscription."""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required",
        )
    return current_user
