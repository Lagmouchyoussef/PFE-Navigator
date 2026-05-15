"""Juries application configuration."""

from django.apps import AppConfig


class JuriesConfig(AppConfig):
    """Configuration for the juries application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.juries'
    verbose_name = 'Jury Management'
    
    def ready(self):
        """Initialize the application."""
        pass
