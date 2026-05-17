"""Custom exception handler and exception classes for PFE Navigator API."""

import logging

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Wrap DRF default handler to always return a consistent JSON shape."""
    response = exception_handler(exc, context)

    if response is None:
        logger.exception("Unhandled exception in %s", context.get("request", {}).path if context.get("request") else "?")
        return Response(
            {"detail": "An unexpected server error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # Normalise all error payloads to {"detail": "..."}  or {"field": ["..."]}
    if isinstance(response.data, dict) and "detail" not in response.data:
        response.data = {"errors": response.data}

    return response


# ── Semantic exception classes ────────────────────────────────────────────────

class InvalidCredentialsException(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Invalid credentials provided."
    default_code = "invalid_credentials"


class InsufficientPermissionsException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "You do not have permission to perform this action."
    default_code = "insufficient_permissions"


class ResourceNotFoundException(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "The requested resource was not found."
    default_code = "resource_not_found"


class ConflictException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "The request conflicts with existing data."
    default_code = "conflict"


class BusinessRuleException(APIException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = "Business rule violation."
    default_code = "business_rule_violation"
