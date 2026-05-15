"""Admin configuration for the supervisors application."""

from django.contrib import admin
from .models import Supervisor


@admin.register(Supervisor)
class SupervisorAdmin(admin.ModelAdmin):
    """Admin configuration for Supervisor model."""
    
    list_display = ['employee_id', 'user', 'department']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'department']
    list_filter = ['department']
