"""Projects application configuration."""

from django.apps import AppConfig


class ProjectsConfig(AppConfig):
    """Configuration for the projects application."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.projects'
    verbose_name = 'Project Management'
    
    def ready(self):
        """Initialize the application."""
        pass
