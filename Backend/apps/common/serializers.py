from rest_framework import serializers
from .models import Subject, Message, Notification, AdminNote, Resource


class SubjectSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'title', 'description', 'year', 'status', 'supervisor', 'supervisor_name', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_name', 'sender_role',
            'recipient', 'recipient_name',
            'subject', 'content', 'is_read', 'parent', 'created_at',
        ]
        read_only_fields = ['sender', 'sender_name', 'sender_role', 'recipient_name', 'is_read', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'link', 'is_read', 'created_at']
        read_only_fields = ['created_at']


class AdminNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = AdminNote
        fields = [
            'id', 'author', 'author_name', 'title', 'content',
            'audience', 'is_pinned', 'created_at', 'updated_at',
        ]
        read_only_fields = ['author', 'author_name', 'created_at', 'updated_at']


class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.name', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'file', 'file_url', 'url',
            'type', 'uploaded_by', 'uploaded_by_name', 'created_at',
        ]
        read_only_fields = ['uploaded_by', 'uploaded_by_name', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
