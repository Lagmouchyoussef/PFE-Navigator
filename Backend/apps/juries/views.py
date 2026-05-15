"""Views for the juries application."""

from rest_framework import viewsets
from rest_framework.response import Response


class JuryViewSet(viewsets.ViewSet):
    """ViewSet for jury operations."""
    
    def list(self, request):
        """List all jury members."""
        return Response({'juries': []})
