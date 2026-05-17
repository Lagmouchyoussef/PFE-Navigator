from rest_framework import serializers
from .models import Subject, Message, Notification


class SubjectSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'title', 'description', 'year', 'status', 'supervisor', 'supervisor_name', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.name', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'subject', 'content', 'is_read', 'parent', 'created_at',
        ]
        read_only_fields = ['sender', 'sender_name', 'recipient_name', 'is_read', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'link', 'is_read', 'created_at']
        read_only_fields = ['title', 'message', 'type', 'link', 'created_at']
