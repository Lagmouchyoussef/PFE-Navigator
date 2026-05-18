from rest_framework import serializers
from apps.common.models import (
    Subject, Project, Document, DocumentRemark,
    Milestone, Appointment, Evaluation, Feedback, JuryAssignment,
)
from apps.authentication.models import User


class UserMiniSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'name', 'role', 'institutional_id']


class SubjectSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'title', 'description', 'year', 'status', 'supervisor', 'supervisor_name', 'created_at']


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'project', 'title', 'description', 'status', 'date', 'order']


class ProjectListSerializer(serializers.ModelSerializer):
    student = UserMiniSerializer(read_only=True)
    supervisor = UserMiniSerializer(read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)
    subject_title = serializers.CharField(source='subject.title', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status',
            'student', 'student_name', 'supervisor', 'supervisor_name',
            'subject', 'subject_title', 'start_date', 'end_date',
            'created_at', 'updated_at', 'milestones',
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'student', 'supervisor', 'subject', 'start_date', 'end_date']
        extra_kwargs = {
            'student': {'required': False},
        }


class DocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField()
    size = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'project', 'student', 'student_name', 'title',
            'file', 'file_url', 'size', 'version', 'status', 'target',
            'comment', 'uploaded_at',
        ]
        read_only_fields = ['student', 'student_name', 'size', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class DocumentRemarkSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = DocumentRemark
        fields = ['id', 'document', 'author', 'author_name', 'comment', 'score', 'created_at']
        read_only_fields = ['author', 'author_name', 'created_at']


class AppointmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'project', 'title', 'student', 'student_name',
            'supervisor', 'supervisor_name', 'date', 'time', 'location',
            'type', 'status', 'notes', 'created_at',
        ]
        read_only_fields = ['student_name', 'supervisor_name', 'created_at']


class EvaluationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    student_name = serializers.CharField(source='project.student.name', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'project', 'project_title', 'student_name',
            'supervisor_score', 'jury_score',
            'supervisor_comment', 'jury_comment',
            'supervisor_criteria', 'jury_criteria',
            'supervisor_weight', 'jury_weight',
            'is_published', 'created_at', 'updated_at',
        ]


class FeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'project', 'author', 'author_name', 'title', 'comment', 'created_at']
        read_only_fields = ['author', 'author_name', 'created_at']


class JuryAssignmentSerializer(serializers.ModelSerializer):
    jury_member_name = serializers.CharField(source='jury_member.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    student_name = serializers.CharField(source='project.student.name', read_only=True)

    class Meta:
        model = JuryAssignment
        fields = [
            'id', 'project', 'project_title', 'student_name',
            'jury_member', 'jury_member_name', 'role', 'assigned_at',
        ]
        read_only_fields = ['assigned_at']
