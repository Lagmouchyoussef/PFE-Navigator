"""Serializers for the projects application."""

import os
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Project, ProjectMilestone, Document, DocumentRemark,
    Appointment, Evaluation, Feedback, JuryAssignment
)

User = get_user_model()

ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf', '.doc', '.docx', '.odt', '.txt', '.zip', '.png', '.jpg', '.jpeg'}
MAX_UPLOAD_SIZE_MB = 20
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024


class UserSimpleSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username


class StudentSimpleSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        from apps.students.models import Student
        model = Student
        fields = ['id', 'name', 'email', 'enrollment_number', 'specialization', 'academic_year']

    def get_name(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full or obj.user.username


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = ['id', 'project', 'title', 'description', 'status', 'due_date', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DocumentRemarkSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)

    class Meta:
        model = DocumentRemark
        fields = ['id', 'document', 'author', 'author_name', 'author_role', 'comment', 'score', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class DocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='project.student.user.get_full_name', read_only=True)
    remarks = DocumentRemarkSerializer(many=True, read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_url', 'target', 'status',
            'version', 'rejection_reason', 'created_at', 'student_name', 'remarks'
        ]
        read_only_fields = ['id', 'version', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def validate_file(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
            raise serializers.ValidationError(
                f"File type '{ext}' is not allowed. Allowed types: {', '.join(sorted(ALLOWED_DOCUMENT_EXTENSIONS))}"
            )
        if value.size > MAX_UPLOAD_SIZE_BYTES:
            raise serializers.ValidationError(
                f"File size must not exceed {MAX_UPLOAD_SIZE_MB} MB."
            )
        return value

    def validate_title(self, value):
        if len(value.strip()) == 0:
            raise serializers.ValidationError("Title cannot be empty.")
        return value[:255]


class AppointmentSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'project', 'created_by', 'created_by_name', 'title', 'description',
            'date', 'time', 'location', 'type', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class EvaluationSerializer(serializers.ModelSerializer):
    final_score = serializers.ReadOnlyField()

    class Meta:
        model = Evaluation
        fields = [
            'id', 'supervisor_score', 'supervisor_comment', 'supervisor_criteria',
            'jury_score', 'jury_comment', 'jury_criteria',
            'technical_quality', 'innovation', 'documentation',
            'implementation', 'presentation', 'comments',
            'is_published', 'supervisor_weight', 'jury_weight',
            'final_score', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'title', 'comment', 'author_name', 'author_role', 'created_at']


class JuryAssignmentSerializer(serializers.ModelSerializer):
    jury_member_name = serializers.CharField(source='jury_member.get_full_name', read_only=True)
    jury_member_email = serializers.CharField(source='jury_member.email', read_only=True)

    class Meta:
        model = JuryAssignment
        fields = ['id', 'project', 'jury_member', 'jury_member_name', 'jury_member_email', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProjectSerializer(serializers.ModelSerializer):
    supervisor = UserSimpleSerializer(read_only=True)
    supervisor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='supervisor'),
        source='supervisor', write_only=True, required=False, allow_null=True
    )
    student = StudentSimpleSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status',
            'start_date', 'end_date', 'supervisor', 'supervisor_id',
            'student', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectDetailSerializer(ProjectSerializer):
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    appointments = AppointmentSerializer(many=True, read_only=True)
    feedbacks = FeedbackSerializer(many=True, read_only=True)
    evaluation = EvaluationSerializer(read_only=True)
    jury_assignments = JuryAssignmentSerializer(many=True, read_only=True)

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + [
            'milestones', 'documents', 'appointments',
            'feedbacks', 'evaluation', 'jury_assignments'
        ]
