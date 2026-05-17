"""Serializers for the projects application."""

import os

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Document, Evaluation, Project, Schedule

User = get_user_model()

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".odt", ".txt", ".zip", ".png", ".jpg", ".jpeg"}
MAX_UPLOAD_BYTES = 20 * 1024 * 1024  # 20 MB


class UserMiniSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "role"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.email


class ProjectSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    supervisor_name = serializers.SerializerMethodField()
    student_id = serializers.IntegerField(source="student.id", read_only=True)
    supervisor_id = serializers.IntegerField(source="supervisor.id", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "description", "status",
            "start_date", "end_date",
            "student_id", "student_name",
            "supervisor_id", "supervisor_name",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.email

    def get_supervisor_name(self, obj):
        return obj.supervisor.user.get_full_name() or obj.supervisor.user.email

    def validate(self, attrs):
        # A student can have only one IN_PROGRESS or APPROVED project
        status = attrs.get("status", Project.STATUS_DRAFT)
        student = attrs.get("student", getattr(self.instance, "student", None))
        if student and status in (Project.STATUS_IN_PROGRESS, Project.STATUS_APPROVED):
            qs = Project.objects.filter(
                student=student,
                status__in=[Project.STATUS_IN_PROGRESS, Project.STATUS_APPROVED],
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "This student already has an active project."
                )
        return attrs


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["title", "description", "start_date", "end_date", "supervisor"]


class EvaluationSerializer(serializers.ModelSerializer):
    evaluator_name = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = [
            "id", "project", "evaluator", "evaluator_name",
            "grade", "comments", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "evaluator", "created_at", "updated_at"]

    def get_evaluator_name(self, obj):
        return obj.evaluator.get_full_name() or obj.evaluator.email

    def validate_grade(self, value):
        if value < 0 or value > 20:
            raise serializers.ValidationError("Grade must be between 0 and 20.")
        return value


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id", "project", "title", "file", "file_url",
            "uploaded_by", "uploaded_by_name",
            "created_at",
        ]
        read_only_fields = ["id", "uploaded_by", "created_at"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.get_full_name() or obj.uploaded_by.email

    def validate_file(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"File type '{ext}' not allowed. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )
        if value.size > MAX_UPLOAD_BYTES:
            raise serializers.ValidationError("File must not exceed 20 MB.")
        return value


class ScheduleSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    jury_names = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = [
            "id", "project", "project_title", "jury_members", "jury_names",
            "date", "location", "status", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_jury_names(self, obj):
        return [
            jp.user.get_full_name() or jp.user.email
            for jp in obj.jury_members.select_related("user").all()
        ]


class AdminDashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_supervisors = serializers.IntegerField()
    total_jury = serializers.IntegerField()
    total_projects = serializers.IntegerField()
    projects_by_status = serializers.DictField(child=serializers.IntegerField())
    total_evaluations = serializers.IntegerField()
    total_documents = serializers.IntegerField()
