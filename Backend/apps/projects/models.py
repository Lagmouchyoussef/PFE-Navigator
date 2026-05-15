"""Data models for the projects application."""

from django.db import models
from django.conf import settings
from apps.core.models import Timestamp
from apps.students.models import Student


class Project(Timestamp):
    """Research project model."""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='projects')
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='supervised_projects'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class JuryAssignment(Timestamp):
    """Assignment of jury members to projects."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='jury_assignments')
    jury_member = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='jury_project_assignments'
    )
    role = models.CharField(max_length=50, default='evaluator')

    class Meta:
        unique_together = ('project', 'jury_member')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.jury_member.get_full_name()} → {self.project.title}"


class ProjectMilestone(Timestamp):
    """Milestones for a project."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class Document(Timestamp):
    """Documents uploaded by students."""

    TARGET_CHOICES = [
        ('supervisor', 'Supervisor'),
        ('jury', 'Jury'),
        ('administration', 'Administration'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='project_documents/%Y/%m/%d/')
    target = models.CharField(max_length=20, choices=TARGET_CHOICES, default='supervisor')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    version = models.PositiveIntegerField(default=1)
    rejection_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class DocumentRemark(Timestamp):
    """Remarks and scores given by jury/supervisor on documents."""

    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='remarks')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='document_remarks'
    )
    comment = models.TextField()
    score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Remark by {self.author.get_full_name()} on {self.document.title}"


class Appointment(Timestamp):
    """Meetings and deadlines for the calendar."""

    TYPE_CHOICES = [
        ('meeting', 'Meeting'),
        ('deadline', 'Deadline'),
        ('defense', 'Defense'),
        ('code_review', 'Code Review'),
    ]

    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        related_name='appointments', null=True, blank=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='created_appointments'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255, default='Online Portal')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='meeting')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.title} on {self.date}"


class Evaluation(Timestamp):
    """Project evaluation model."""

    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='evaluation')

    # Supervisor evaluation
    supervisor_score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    supervisor_comment = models.TextField(blank=True)
    supervisor_criteria = models.JSONField(default=dict, blank=True)

    # Jury evaluation
    jury_score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    jury_comment = models.TextField(blank=True)
    jury_criteria = models.JSONField(default=dict, blank=True)

    # Legacy criteria scores (0-100)
    technical_quality = models.PositiveIntegerField(default=0)
    innovation = models.PositiveIntegerField(default=0)
    documentation = models.PositiveIntegerField(default=0)
    implementation = models.PositiveIntegerField(default=0)
    presentation = models.PositiveIntegerField(default=0)

    comments = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)

    # Weights
    supervisor_weight = models.PositiveIntegerField(default=50)
    jury_weight = models.PositiveIntegerField(default=50)

    class Meta:
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
        ordering = ['-created_at']

    def __str__(self):
        return f"Evaluation of {self.project.title}"

    @property
    def final_score(self):
        if self.supervisor_score is not None and self.jury_score is not None:
            return (
                float(self.supervisor_score) * (self.supervisor_weight / 100) +
                float(self.jury_score) * (self.jury_weight / 100)
            )
        return self.supervisor_score or self.jury_score


class Feedback(Timestamp):
    """Feedback from supervisor or jury members."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='feedbacks')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='given_feedbacks'
    )
    title = models.CharField(max_length=255)
    comment = models.TextField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback for {self.project.title} by {self.author.get_full_name()}"
