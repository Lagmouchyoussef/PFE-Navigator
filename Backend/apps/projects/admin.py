"""Admin configuration for the projects application."""

from django.contrib import admin
from .models import Project, Evaluation


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Admin configuration for Project model."""
    
    list_display = ['title', 'student', 'status', 'start_date', 'end_date']
    search_fields = ['title', 'description']
    list_filter = ['status', 'start_date']
    date_hierarchy = 'created_at'


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    """Admin configuration for Evaluation model."""
    
    list_display = ['project', 'evaluator', 'grade']
    search_fields = ['project__title']
    list_filter = ['grade']
