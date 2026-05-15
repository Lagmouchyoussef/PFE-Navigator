"""Views for the students application."""

from rest_framework import viewsets
from rest_framework.response import Response


class StudentViewSet(viewsets.ViewSet):
    """ViewSet for student operations."""
    
    def list(self, request):
        """List all students."""
        return Response({'students': []})
