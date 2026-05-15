"""Serializers for the projects application."""

from rest_framework import serializers
from .models import Project, Evaluation


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for project data."""
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'start_date', 'end_date', 'created_at', 'updated_at']


class EvaluationSerializer(serializers.ModelSerializer):
    """Serializer for evaluation data."""
    
    class Meta:
        model = Evaluation
        fields = ['id', 'grade', 'comments', 'created_at', 'updated_at']
