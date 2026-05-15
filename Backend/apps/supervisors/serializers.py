"""Serializers for the supervisors application."""

from rest_framework import serializers
from .models import Supervisor


class SupervisorSerializer(serializers.ModelSerializer):
    """Serializer for supervisor data."""
    
    class Meta:
        model = Supervisor
        fields = ['id', 'employee_id', 'department', 'specialization_areas', 'created_at', 'updated_at']
