"""Students application configuration."""

from django.apps import AppConfig


class StudentsConfig(AppConfig):
    """Configuration for the students application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.students'
    verbose_name = 'Student Management'
    
    def ready(self):
        """Initialize the application."""
        pass
