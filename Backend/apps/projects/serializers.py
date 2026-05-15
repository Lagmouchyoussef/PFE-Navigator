"""Serializers for the projects application."""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, ProjectMilestone, Document, Appointment, Evaluation, Feedback

User = get_user_model()


class UserSimpleSerializer(serializers.ModelSerializer):
    """Simple serializer for user info (supervisor/author)."""
    name = serializers.CharField(source='get_full_name')
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='project.student.user.get_full_name', read_only=True)
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'target', 'status', 'version', 'created_at', 'student_name']


class AppointmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='project.student.user.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'


class EvaluationSerializer(serializers.ModelSerializer):
    evaluator = UserSimpleSerializer(read_only=True)
    
    class Meta:
        model = Evaluation
        fields = [
            'id', 'supervisor_score', 'jury_score', 
            'technical_quality', 'innovation', 'documentation', 
            'implementation', 'presentation', 'comments', 
            'is_published', 'evaluator', 'created_at'
        ]


class FeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'title', 'comment', 'author_name', 'created_at']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for project data."""
    supervisor = UserSimpleSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'start_date', 'end_date', 'supervisor', 'created_at', 'updated_at']


class ProjectDetailSerializer(ProjectSerializer):
    """Detailed serializer for project dashboard."""
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    appointments = AppointmentSerializer(many=True, read_only=True)
    feedbacks = FeedbackSerializer(many=True, read_only=True)
    evaluation = EvaluationSerializer(read_only=True)
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['milestones', 'documents', 'appointments', 'feedbacks', 'evaluation']
