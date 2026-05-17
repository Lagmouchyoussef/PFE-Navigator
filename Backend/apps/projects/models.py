"""Data models for the projects application."""

from django.conf import settings
from django.db import models
from django.db.models import Q
from django.core.validators import MaxValueValidator, MinValueValidator
from apps.core.models import Timestamp


class Project(Timestamp):
    """Research project model."""

    STATUS_DRAFT = 'DRAFT'
    STATUS_SUBMITTED = 'SUBMITTED'
    STATUS_UNDER_REVIEW = 'UNDER_REVIEW'
    STATUS_APPROVED = 'APPROVED'
    STATUS_IN_PROGRESS = 'IN_PROGRESS'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_REJECTED = 'REJECTED'

    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_SUBMITTED, 'Submitted'),
        (STATUS_UNDER_REVIEW, 'Under Review'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT, db_index=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.PROTECT,
        related_name='projects'
    )
    supervisor = models.ForeignKey(
        'supervisors.SupervisorProfile',
        on_delete=models.PROTECT,
        related_name='projects'
    )

    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['student'],
                condition=Q(status__in=['IN_PROGRESS', 'APPROVED']),
                name='unique_active_project_per_student',
            ),
        ]
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title


class Evaluation(Timestamp):
    """Project evaluation model."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='evaluations'
    )
    grade = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(20)]
    )
    comments = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project.title} evaluation by {self.evaluator.get_full_name()}"


class Document(Timestamp):
    """Documents uploaded for a project."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/%Y/%m/')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='uploaded_documents'
    )

    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Schedule(Timestamp):
    """Project defense / review schedule."""

    STATUS_SCHEDULED = 'SCHEDULED'
    STATUS_ONGOING = 'ONGOING'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_CANCELLED = 'CANCELLED'

    project = models.ForeignKey(Project, on_delete=models.PROTECT, related_name='schedules')
    jury_members = models.ManyToManyField('juries.JuryProfile', related_name='schedules')
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[
            (STATUS_SCHEDULED, 'Scheduled'),
            (STATUS_ONGOING, 'Ongoing'),
            (STATUS_COMPLETED, 'Completed'),
            (STATUS_CANCELLED, 'Cancelled'),
        ],
        default=STATUS_SCHEDULED,
        db_index=True,
    )

    class Meta:
        verbose_name = 'Schedule'
        verbose_name_plural = 'Schedules'
        ordering = ['-date']

    def __str__(self):
        return f"{self.project.title} @ {self.date.isoformat()}"
