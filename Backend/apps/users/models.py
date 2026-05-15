"""Data models for the users (authentication) application."""

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Extended user model with role-based access."""
    
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('supervisor', 'Supervisor'),
        ('jury', 'Jury Member'),
        ('student', 'Student'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student'
    )
    institutional_id = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True
    )
    phone_number = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )
    is_active_user = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
