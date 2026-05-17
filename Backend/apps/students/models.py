"""Models for the students application."""

from django.conf import settings
from django.db import models
from apps.core.models import Timestamp


class StudentProfile(Timestamp):
    """Profile data for a student user."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    enrollment_number = models.CharField(max_length=50, unique=True, db_index=True)
    specialization = models.CharField(max_length=255, blank=True)
    academic_year = models.CharField(max_length=20)
    supervisor = models.ForeignKey(
        'supervisors.SupervisorProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )

    class Meta:
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'
        ordering = ['user__last_name', 'user__first_name']

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.enrollment_number})"
