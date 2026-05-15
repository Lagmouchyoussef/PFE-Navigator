"""Users application configuration."""

from django.apps import AppConfig


class UsersConfig(AppConfig):
    """Configuration for the users (authentication) application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = 'User Management'
    
    def ready(self):
        """Initialize the application."""
        pass
