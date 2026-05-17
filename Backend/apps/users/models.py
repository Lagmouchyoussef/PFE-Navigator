"""Data models for the users (authentication) application."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Single user model with role support and secure identity fields."""

    ROLE_ADMIN = 'ADMIN'
    ROLE_SUPERVISOR = 'SUPERVISOR'
    ROLE_JURY = 'JURY'
    ROLE_STUDENT = 'STUDENT'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_SUPERVISOR, 'Supervisor'),
        (ROLE_JURY, 'Jury'),
        (ROLE_STUDENT, 'Student'),
    ]

    username = models.CharField(max_length=150, unique=True, db_index=True)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STUDENT, db_index=True)
    phone_number = models.CharField(max_length=20, blank=True)
    institutional_id = models.CharField(max_length=50, unique=True, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return self.get_full_name() or self.email
