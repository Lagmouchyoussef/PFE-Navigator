"""Data models for the students application."""

from django.db import models
from apps.core.models import Timestamp
from apps.users.models import User


class Student(Timestamp):
    """Student model representing a student in the research portal."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    enrollment_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=255, blank=True)
    academic_year = models.CharField(max_length=20)
    
    class Meta:
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['user__last_name', 'user__first_name']
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.enrollment_number})"
