"""Views for the core application."""

from rest_framework.views import APIView
from rest_framework.response import Response


class HealthCheckView(APIView):
    """Health check endpoint."""
    
    def get(self, request):
        """Return API status."""
        return Response({'status': 'ok', 'message': 'Scientific Research Portal API is running'})
