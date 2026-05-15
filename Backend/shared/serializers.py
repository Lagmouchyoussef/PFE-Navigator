"""
Base serializers for the Scientific Research Portal API.

Provides common serializer functionality and base classes.
"""

from rest_framework import serializers


class TimestampedModelSerializer(serializers.ModelSerializer):
    """
    Base serializer for models with created_at and updated_at fields.
    
    Automatically includes timestamp fields and provides common functionality.
    """
    
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        fields = ['id', 'created_at', 'updated_at']


class BaseResponseSerializer(serializers.Serializer):
    """Base serializer for standard API responses."""
    
    success = serializers.BooleanField()
    message = serializers.CharField(required=False)
    data = serializers.JSONField(required=False)
    errors = serializers.JSONField(required=False)
