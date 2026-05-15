"""
Shared exceptions and error handling for the Scientific Research Portal API.

Defines custom exception classes used throughout the application.
"""

from rest_framework.exceptions import APIException
from rest_framework import status


class InvalidCredentialsException(APIException):
    """Raised when user credentials are invalid."""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Invalid credentials provided.'
    default_code = 'invalid_credentials'


class InsufficientPermissionsException(APIException):
    """Raised when user lacks required permissions."""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'You do not have permission to perform this action.'
    default_code = 'insufficient_permissions'


class ResourceNotFoundException(APIException):
    """Raised when requested resource is not found."""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'The requested resource was not found.'
    default_code = 'resource_not_found'


class ValidationException(APIException):
    """Raised when request validation fails."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid request data.'
    default_code = 'validation_error'


class ConflictException(APIException):
    """Raised when request conflicts with existing data."""
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'The request conflicts with existing data.'
    default_code = 'conflict'
