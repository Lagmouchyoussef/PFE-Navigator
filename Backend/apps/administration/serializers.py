from rest_framework import serializers
from apps.authentication.models import User
from apps.common.models import Subject, Project, Evaluation, Resource, AdminNote, JuryAssignment


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'name', 'role',
            'institutional_id', 'phone_number', 'department',
            'is_active', 'date_joined',
        ]
        read_only_fields = ['date_joined']


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name', 'role',
            'institutional_id', 'phone_number', 'department',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AdminSubjectSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Subject
        fields = [
            'id', 'title', 'description', 'year', 'status',
            'supervisor', 'supervisor_name', 'created_at',
        ]
        read_only_fields = ['created_at']


class AdminProjectSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    subject_title = serializers.CharField(source='subject.title', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'start_date', 'end_date',
            'student', 'student_name', 'supervisor', 'supervisor_name',
            'subject_title', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class AdminEvaluationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    student_name = serializers.CharField(source='project.student.name', read_only=True)

    class Meta:
        model = Evaluation
        fields = '__all__'


class JuryAssignmentSerializer(serializers.ModelSerializer):
    jury_member_name = serializers.CharField(source='jury_member.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = JuryAssignment
        fields = [
            'id', 'project', 'project_title',
            'jury_member', 'jury_member_name', 'role', 'assigned_at',
        ]
        read_only_fields = ['assigned_at']


class AdminResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.name', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'file', 'url', 'type',
            'uploaded_by_name', 'created_at',
        ]
        read_only_fields = ['uploaded_by_name', 'created_at']


class AdminNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = AdminNote
        fields = [
            'id', 'title', 'content', 'audience', 'is_pinned',
            'author_name', 'created_at', 'updated_at',
        ]
        read_only_fields = ['author_name', 'created_at', 'updated_at']
