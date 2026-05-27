"""Authentication and security utilities — JWT tokens, password hashing."""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Password hashing ─────────────────────────────────────────────


def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plaintext password against its hash."""
    return pwd_context.verify(plain, hashed)


# ── JWT tokens ───────────────────────────────────────────────────

ALGORITHM = settings.JWT_ALGORITHM


def create_access_token(
    subject: str,
    extra_claims: dict | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a short-lived access token."""
    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": subject, "exp": expire, "type": "access"}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str) -> str:
    """Create a long-lived refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {"sub": subject, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token. Raises JWTError on failure."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise


# ── Password security ─────────────────────────────────────────────

def validate_password_strength(password: str) -> tuple[bool, str | None]:
    """
    Validate password meets security requirements:
    - At least 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 12:
        return False, "Password must be at least 12 characters long"

    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"

    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"

    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"

    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if not any(c in special_chars for c in password):
        return False, "Password must contain at least one special character"

    return True, None


# ── Input sanitization ────────────────────────────────────────────

def sanitize_input(input_str: str, max_length: int = 255) -> str:
    """Sanitize user input to prevent injection attacks"""
    if not isinstance(input_str, str):
        raise ValueError("Input must be a string")

    # Limit length
    input_str = input_str[:max_length]

    # Remove null bytes (can bypass filters)
    input_str = input_str.replace("\x00", "")

    return input_str.strip()
