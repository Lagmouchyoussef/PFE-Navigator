"""Data models for the supervisors application."""

from django.conf import settings
from django.db import models
from apps.core.models import Timestamp


class SupervisorProfile(Timestamp):
    """Profile data for a supervisor user."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='supervisor_profile'
    )
    employee_id = models.CharField(max_length=50, unique=True, db_index=True)
    department = models.CharField(max_length=255)
    specialization_areas = models.JSONField(default=list, blank=True)
    max_students = models.PositiveIntegerField(default=5)

    class Meta:
        verbose_name = 'Supervisor Profile'
        verbose_name_plural = 'Supervisor Profiles'
        ordering = ['user__last_name', 'user__first_name']

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.department})"
