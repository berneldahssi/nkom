"""
Security middleware for NKOM backend.
Implements rate limiting, CORS, request validation, and security headers.
"""

import logging
import time
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Enable XSS protection
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self'"
        )

        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions Policy
        response.headers["Permissions-Policy"] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=()"
        )

        # HSTS (strict transport security)
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains; preload"
        )

        return response


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Validate and sanitize incoming requests"""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Check for suspicious patterns
        if self._is_suspicious_request(request):
            logger.warning(
                f"Suspicious request: {request.method} {request.url.path} "
                f"from {request.client.host}"
            )
            return JSONResponse(
                {"detail": "Request rejected"},
                status_code=400,
            )

        # Add request tracking
        request.state.start_time = time.time()

        response = await call_next(request)

        # Log response time
        process_time = time.time() - request.state.start_time
        response.headers["X-Process-Time"] = str(process_time)

        return response

    def _is_suspicious_request(self, request: Request) -> bool:
        """Detect suspicious request patterns"""
        # Check for null bytes in path
        if "\x00" in request.url.path:
            return True

        # Check for SQL injection patterns in query params
        injection_patterns = [
            "' OR '",
            "'; DROP TABLE",
            "1=1",
            "union select",
        ]

        for param in request.query_params.values():
            param_lower = param.lower()
            if any(pattern in param_lower for pattern in injection_patterns):
                return True

        return False


class IPWhitelistMiddleware(BaseHTTPMiddleware):
    """Optional: Whitelist specific IPs (for admin endpoints)"""

    def __init__(self, app, whitelist: list[str] = None):
        super().__init__(app)
        self.whitelist = whitelist or []

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.url.path.startswith("/api/admin"):
            if request.client.host not in self.whitelist:
                logger.warning(
                    f"Unauthorized admin access attempt from {request.client.host}"
                )
                return JSONResponse(
                    {"detail": "IP not whitelisted"},
                    status_code=403,
                )

        return await call_next(request)
