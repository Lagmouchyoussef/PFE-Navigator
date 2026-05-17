"""Serializers for the users (authentication) application."""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.students.models import StudentProfile
from apps.supervisors.models import SupervisorProfile
from apps.juries.models import JuryProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone_number',
            'institutional_id',
            'is_active',
            'created_at',
            'updated_at',
            'password',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
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
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def _create_role_profile(self, user):
        defaults = {
            User.ROLE_STUDENT: {
                'enrollment_number': user.institutional_id or f"STU{user.id:04d}",
                'academic_year': '2024-2025',
            },
            User.ROLE_SUPERVISOR: {
                'employee_id': user.institutional_id or f"SUP{user.id:04d}",
                'department': 'General',
            },
            User.ROLE_JURY: {
                'employee_id': user.institutional_id or f"JUR{user.id:04d}",
            },
        }

        if user.role == User.ROLE_STUDENT:
            StudentProfile.objects.get_or_create(user=user, defaults=defaults[User.ROLE_STUDENT])
        elif user.role == User.ROLE_SUPERVISOR:
            SupervisorProfile.objects.get_or_create(user=user, defaults=defaults[User.ROLE_SUPERVISOR])
        elif user.role == User.ROLE_JURY:
            JuryProfile.objects.get_or_create(user=user, defaults=defaults[User.ROLE_JURY])
