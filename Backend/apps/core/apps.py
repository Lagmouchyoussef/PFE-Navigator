"""Core application configuration."""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    """Configuration for the core (shared) application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    verbose_name = 'Core Functionality'
    
    def ready(self):
        """Initialize the application."""
        pass
