"""Serializers for the students application."""

from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for student data."""
    
    class Meta:
        model = Student
        fields = ['id', 'enrollment_number', 'specialization', 'academic_year', 'created_at', 'updated_at']
