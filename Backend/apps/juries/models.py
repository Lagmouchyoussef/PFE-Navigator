"""Data models for the juries application."""

from django.db import models
from apps.core.models import Timestamp
from apps.users.models import User


class Jury(Timestamp):
    """Jury member model representing a member of the evaluation jury."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='jury_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    expertise_areas = models.TextField(help_text="Comma-separated areas of expertise")
    institution = models.CharField(max_length=255, blank=True)
    
    class Meta:
        verbose_name = 'Jury Member'
        verbose_name_plural = 'Jury Members'
        ordering = ['user__last_name', 'user__first_name']
    
    def __str__(self):
        return f"Jury - {self.user.get_full_name()}"
