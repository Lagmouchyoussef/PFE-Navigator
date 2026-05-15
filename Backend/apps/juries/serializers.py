"""Serializers for the juries application."""

from rest_framework import serializers
from .models import Jury


class JurySerializer(serializers.ModelSerializer):
    """Serializer for jury member data."""
    
    class Meta:
        model = Jury
        fields = ['id', 'employee_id', 'expertise_areas', 'institution', 'created_at', 'updated_at']
