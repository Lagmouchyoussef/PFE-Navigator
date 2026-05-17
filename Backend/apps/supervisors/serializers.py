"""Serializers for the supervisors application."""

from rest_framework import serializers

from apps.users.serializers import UserSerializer
from .models import SupervisorProfile


class SupervisorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = SupervisorProfile
        fields = [
            "id", "user", "full_name", "employee_id", "department",
            "specialization_areas", "max_students", "student_count",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.email

    def get_student_count(self, obj):
        return obj.students.count()


class SupervisorProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorProfile
        fields = ["department", "specialization_areas", "max_students"]
