"""Serializers for the users (authentication) application."""

from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data."""
    name = serializers.SerializerMethodField()
    institutionalId = serializers.CharField(source='institutional_id', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'name', 'role', 'institutionalId']
        read_only_fields = ['id']

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name if full_name else obj.username
