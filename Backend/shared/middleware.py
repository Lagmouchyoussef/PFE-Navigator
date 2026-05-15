"""
Shared middleware for the Scientific Research Portal API.

Defines custom middleware for request/response processing.
"""

import logging
import time
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    """Middleware to log request details and execution time."""
    
    def process_request(self, request):
        """Log incoming request."""
        request.start_time = time.time()
        logger.info(
            f'[{request.method}] {request.path} - User: {request.user} - IP: {self._get_client_ip(request)}'
        )
        return None
    
    def process_response(self, request, response):
        """Log response with execution time."""
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(
                f'Response: {response.status_code} - Duration: {duration:.2f}s - Path: {request.path}'
            )
        return response
    
    @staticmethod
    def _get_client_ip(request):
        """Extract client IP from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class APIExceptionMiddleware(MiddlewareMixin):
    """Middleware for consistent API error responses."""
    
    def process_exception(self, request, exception):
        """Handle exceptions and return consistent error response."""
        logger.exception(f'Unhandled exception in {request.path}')
        return None
