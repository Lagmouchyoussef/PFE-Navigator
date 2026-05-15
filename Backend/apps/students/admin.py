"""Admin configuration for the students application."""

from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """Admin configuration for Student model."""
    
    list_display = ['enrollment_number', 'user', 'specialization', 'academic_year']
    search_fields = ['enrollment_number', 'user__first_name', 'user__last_name']
    list_filter = ['academic_year']
