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
    supervisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='supervised_projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    
    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class ProjectMilestone(Timestamp):
    """Milestones for a project, used in the stepper."""
    
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
    
    class Meta:
        ordering = ['created_at']

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
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


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
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='appointments')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255, default='Online Portal')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='meeting')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    
    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.title} on {self.date}"


class Evaluation(Timestamp):
    """Project evaluation model."""
    
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='evaluation')
    evaluator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='evaluations')
    
    # Detailed Scores (0-20)
    supervisor_score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    jury_score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    
    # Criteria Scores (0-100)
    technical_quality = models.PositiveIntegerField(default=0)
    innovation = models.PositiveIntegerField(default=0)
    documentation = models.PositiveIntegerField(default=0)
    implementation = models.PositiveIntegerField(default=0)
    presentation = models.PositiveIntegerField(default=0)
    
    comments = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Evaluation of {self.project.title}"


class Feedback(Timestamp):
    """Feedback from supervisor or jury members."""
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='feedbacks')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_feedbacks')
    title = models.CharField(max_length=255)
    comment = models.TextField()
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback for {self.project.title} by {self.author.get_full_name()}"
