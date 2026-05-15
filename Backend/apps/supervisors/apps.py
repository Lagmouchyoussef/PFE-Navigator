"""Supervisors application configuration."""

from django.apps import AppConfig


class SupervisorsConfig(AppConfig):
    """Configuration for the supervisors application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.supervisors'
    verbose_name = 'Supervisor Management'
    
    def ready(self):
        """Initialize the application."""
        pass
