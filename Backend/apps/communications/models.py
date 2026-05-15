"""Models for the communications application."""

from django.db import models
from django.conf import settings
from apps.core.models import Timestamp


class Message(Timestamp):
    """Direct messages between users."""

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='received_messages'
    )
    subject = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    parent = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.CASCADE, related_name='replies'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"From {self.sender} to {self.recipient}: {self.subject or self.content[:40]}"


class Notification(Timestamp):
    """System notifications for users."""

    TYPE_CHOICES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('grade', 'Grade'),
        ('document', 'Document'),
        ('message', 'Message'),
        ('defense', 'Defense'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='sent_notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type}] {self.title} → {self.recipient}"


class AdministrativeNote(Timestamp):
    """Notes published by admin to specific audiences."""

    AUDIENCE_CHOICES = [
        ('all', 'All Users'),
        ('students', 'Students'),
        ('supervisors', 'Supervisors'),
        ('juries', 'Jury Members'),
    ]

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='admin_notes'
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='all')
    is_pinned = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.audience})"


class Resource(Timestamp):
    """Resources shared by admin in the resource hub."""

    TYPE_CHOICES = [
        ('report', 'Report'),
        ('template', 'Template'),
        ('guide', 'Guide'),
        ('project', 'Archived Project'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='resources/%Y/%m/%d/', null=True, blank=True)
    url = models.URLField(blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='guide')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='uploaded_resources'
    )
    year = models.PositiveIntegerField(null=True, blank=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
