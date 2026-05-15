"""Admin configuration for the juries application."""

from django.contrib import admin
from .models import Jury


@admin.register(Jury)
class JuryAdmin(admin.ModelAdmin):
    """Admin configuration for Jury model."""
    
    list_display = ['employee_id', 'user', 'institution']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'institution']
    list_filter = ['institution']
