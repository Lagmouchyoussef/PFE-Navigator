"""Serializers for the students application."""

from rest_framework import serializers

from apps.users.serializers import UserSerializer
from .models import StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    supervisor_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            "id", "user", "full_name", "enrollment_number",
            "specialization", "academic_year", "supervisor", "supervisor_name",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.email

    def get_supervisor_name(self, obj):
        if obj.supervisor:
            return obj.supervisor.user.get_full_name() or obj.supervisor.user.email
        return None


class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ["specialization", "academic_year", "supervisor"]
