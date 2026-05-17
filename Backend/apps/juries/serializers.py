"""Serializers for the juries application."""

from rest_framework import serializers

from apps.users.serializers import UserSerializer
from .models import JuryProfile


class JuryProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = JuryProfile
        fields = [
            "id", "user", "full_name", "employee_id",
            "expertise_areas", "institution",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.email


class JuryProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JuryProfile
        fields = ["expertise_areas", "institution"]
