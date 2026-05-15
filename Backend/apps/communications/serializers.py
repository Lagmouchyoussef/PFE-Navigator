"""Serializers for the communications application."""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message, Notification, AdministrativeNote, Resource

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)
    recipient_role = serializers.CharField(source='recipient.role', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_name', 'sender_role',
            'recipient', 'recipient_name', 'recipient_role',
            'subject', 'content', 'is_read', 'parent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['recipient', 'subject', 'content', 'parent']


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'sender', 'sender_name',
            'title', 'message', 'type', 'is_read', 'link',
            'created_at'
        ]
        read_only_fields = ['id', 'recipient', 'sender', 'created_at']

    def get_sender_name(self, obj):
        if obj.sender:
            full = f"{obj.sender.first_name} {obj.sender.last_name}".strip()
            return full or obj.sender.username
        return "System"


class AdministrativeNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = AdministrativeNote
        fields = [
            'id', 'author', 'author_name', 'title', 'content',
            'audience', 'is_pinned', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']


class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'file', 'file_url',
            'url', 'type', 'uploaded_by', 'uploaded_by_name',
            'year', 'is_public', 'created_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
