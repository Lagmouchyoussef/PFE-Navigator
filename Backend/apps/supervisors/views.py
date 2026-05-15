"""Views for the supervisors application."""

from rest_framework import viewsets
from rest_framework.response import Response


class SupervisorViewSet(viewsets.ViewSet):
    """ViewSet for supervisor operations."""
    
    def list(self, request):
        """List all supervisors."""
        return Response({'supervisors': []})
