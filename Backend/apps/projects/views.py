"""Views for the projects application."""

from rest_framework import viewsets
from rest_framework.response import Response


class ProjectViewSet(viewsets.ViewSet):
    """ViewSet for project operations."""
    
    def list(self, request):
        """List all projects."""
        return Response({'projects': []})
