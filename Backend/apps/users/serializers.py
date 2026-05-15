"""Serializers for the users (authentication) application."""

from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    institutionalId = serializers.CharField(source='institutional_id', required=False, allow_blank=True, allow_null=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'name',
            'role', 'institutionalId', 'phone_number', 'is_active_user',
            'date_joined', 'password'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        institutional_id = validated_data.pop('institutionalId', None)
        if institutional_id:
            validated_data['institutional_id'] = institutional_id
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        self._create_role_profile(user)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        institutional_id = validated_data.pop('institutionalId', None)
        if institutional_id is not None:
            validated_data['institutional_id'] = institutional_id
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def _create_role_profile(self, user):
        """Auto-create role profile when creating a user."""
        if user.role == 'student':
            from apps.students.models import Student
            if not hasattr(user, 'student_profile'):
                Student.objects.create(
                    user=user,
                    enrollment_number=user.institutional_id or f"STU{user.id:04d}",
                    academic_year="2024-2025",
                )
        elif user.role == 'supervisor':
            from apps.supervisors.models import Supervisor
            if not hasattr(user, 'supervisor_profile'):
                Supervisor.objects.create(
                    user=user,
                    employee_id=user.institutional_id or f"SUP{user.id:04d}",
                )
        elif user.role == 'jury':
            from apps.juries.models import Jury
            if not hasattr(user, 'jury_profile'):
                Jury.objects.create(
                    user=user,
                    employee_id=user.institutional_id or f"JUR{user.id:04d}",
                )
