"""
Shared utilities for the Scientific Research Portal API.

Provides utility functions used across the application.
"""

import uuid
from typing import Dict, Any


def generate_unique_id() -> str:
    """Generate a unique identifier."""
    return str(uuid.uuid4())


def format_api_response(success: bool, message: str = '', data: Any = None, errors: Dict = None) -> Dict:
    """
    Format standard API response.
    
    Args:
        success: Whether the request was successful
        message: Response message
        data: Response data
        errors: Error details
        
    Returns:
        Formatted response dictionary
    """
    response = {
        'success': success,
        'message': message,
    }
    
    if data is not None:
        response['data'] = data
    
    if errors is not None:
        response['errors'] = errors
    
    return response


def paginate_queryset(queryset, page: int = 1, page_size: int = 10) -> tuple:
    """
    Paginate a queryset.
    
    Args:
        queryset: Django queryset to paginate
        page: Page number (1-indexed)
        page_size: Number of items per page
        
    Returns:
        Tuple of (paginated_queryset, total_count, total_pages)
    """
    total_count = queryset.count()
    total_pages = (total_count + page_size - 1) // page_size
    
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    return queryset[start_idx:end_idx], total_count, total_pages
