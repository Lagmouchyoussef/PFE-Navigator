"""Serializers for the communications application."""

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, Notification

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "role"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.email


class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)
    receiver = UserMiniSerializer(read_only=True)
    receiver_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="receiver", write_only=True
    )

    class Meta:
        model = Message
        fields = [
            "id", "sender", "receiver", "receiver_id",
            "project", "content", "is_read", "created_at",
        ]
        read_only_fields = ["id", "sender", "is_read", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id", "user", "title", "message", "type",
            "is_read", "related_object_id", "related_object_type", "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]
