"""Data models for the supervisors application."""

from django.db import models
from apps.core.models import Timestamp
from apps.users.models import User


class Supervisor(Timestamp):
    """Supervisor model representing a research supervisor."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=255)
    specialization_areas = models.TextField(help_text="Comma-separated specialization areas")
    
    class Meta:
        verbose_name = 'Supervisor'
        verbose_name_plural = 'Supervisors'
        ordering = ['user__last_name', 'user__first_name']
    
    def __str__(self):
        return f"Prof. {self.user.get_full_name()} ({self.department})"
