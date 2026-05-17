"""Request logging middleware for PFE Navigator API."""

import logging
import time

from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    """Logs method, path, user, IP, status code, and duration for every request."""

    def process_request(self, request):
        request._start_time = time.monotonic()

    def process_response(self, request, response):
        duration_ms = round((time.monotonic() - getattr(request, "_start_time", time.monotonic())) * 1000, 1)
        user = getattr(request, "user", None)
        user_str = str(user.id) if user and user.is_authenticated else "anon"
        logger.info(
            "[%s] %s | user=%s ip=%s status=%s duration=%sms",
            request.method,
            request.path,
            user_str,
            self._client_ip(request),
            response.status_code,
            duration_ms,
        )
        return response

    @staticmethod
    def _client_ip(request) -> str:
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        return xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR", "?")
