"""Data models for the projects application."""

from django.db import models
from apps.core.models import Timestamp
from apps.users.models import User
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
    supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='supervised_projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    
    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Evaluation(Timestamp):
    """Project evaluation model."""
    
    GRADE_CHOICES = [
        ('A', 'Excellent'),
        ('B', 'Good'),
        ('C', 'Satisfactory'),
        ('D', 'Fair'),
        ('F', 'Fail'),
    ]
    
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='evaluation')
    evaluator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='evaluations')
    grade = models.CharField(max_length=1, choices=GRADE_CHOICES)
    comments = models.TextField()
    
    class Meta:
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Evaluation of {self.project.title}"
