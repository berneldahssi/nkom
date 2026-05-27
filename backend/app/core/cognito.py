"""Cognito JWT verification using JWKS — RS256, cached keys."""

import time

import httpx
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError, JWTClaimsError

from app.core.config import settings

_cache: dict = {"keys": {}, "fetched_at": 0.0}
_CACHE_TTL = 3600  # seconds


async def _fetch_jwks() -> dict[str, dict]:
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(settings.cognito_jwks_uri)
        response.raise_for_status()
        jwks = response.json()
    return {k["kid"]: k for k in jwks["keys"]}


async def _get_keys(force_refresh: bool = False) -> dict[str, dict]:
    now = time.monotonic()
    if not force_refresh and _cache["keys"] and (now - _cache["fetched_at"]) < _CACHE_TTL:
        return _cache["keys"]
    _cache["keys"] = await _fetch_jwks()
    _cache["fetched_at"] = now
    return _cache["keys"]


async def verify_cognito_token(token: str) -> dict:
    """Verify a Cognito-issued JWT and return its claims.

    Raises ValueError with a descriptive message on any failure so callers
    can convert it to an HTTP 401 without leaking internal detail.
    """
    try:
        header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise ValueError("Malformed token") from exc

    kid = header.get("kid")
    if not kid:
        raise ValueError("Token missing key ID")

    keys = await _get_keys()
    if kid not in keys:
        # Key may have rotated — refresh once and retry
        keys = await _get_keys(force_refresh=True)
    if kid not in keys:
        raise ValueError("Unknown signing key")

    try:
        claims = jwt.decode(
            token,
            keys[kid],
            algorithms=["RS256"],
            audience=settings.COGNITO_CLIENT_ID,
            issuer=settings.cognito_issuer,
        )
    except ExpiredSignatureError as exc:
        raise ValueError("Token expired") from exc
    except JWTClaimsError as exc:
        raise ValueError("Invalid token claims") from exc
    except JWTError as exc:
        raise ValueError("Token verification failed") from exc

    return claims
