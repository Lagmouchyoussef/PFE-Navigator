"""Data models for the juries application."""

from django.conf import settings
from django.db import models
from apps.core.models import Timestamp


class JuryProfile(Timestamp):
    """Profile data for a jury user."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='jury_profile'
    )
    employee_id = models.CharField(max_length=50, unique=True, db_index=True)
    expertise_areas = models.JSONField(default=list, blank=True)
    institution = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = 'Jury Profile'
        verbose_name_plural = 'Jury Profiles'
        ordering = ['user__last_name', 'user__first_name']

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.institution})"
