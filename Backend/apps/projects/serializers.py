from rest_framework import serializers
from apps.common.models import (
    Subject, SubjectRequest, Project, Document, DocumentRemark,
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
        fields = ['id', 'title', 'description', 'year', 'status', 'is_approved', 'supervisor', 'supervisor_name', 'created_at']


class SubjectRequestSerializer(serializers.ModelSerializer):
    student_name  = serializers.CharField(source='student.name',  read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    subject_title = serializers.CharField(source='subject.title', read_only=True)
    supervisor_name = serializers.CharField(source='subject.supervisor.name', read_only=True)

    class Meta:
        model  = SubjectRequest
        fields = [
            'id', 'student', 'student_name', 'student_email',
            'subject', 'subject_title', 'supervisor_name',
            'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']


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
            'jury_documents_open', 'created_at', 'updated_at', 'milestones',
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'student', 'supervisor', 'subject', 'start_date', 'end_date']
        extra_kwargs = {
            'student': {'required': False},
        }


class DocumentRemarkSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)

    class Meta:
        model = DocumentRemark
        fields = ['id', 'document', 'author', 'author_name', 'author_role', 'comment', 'score', 'created_at']
        read_only_fields = ['author', 'author_name', 'author_role', 'created_at']


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Used for student document uploads — project/student are set in perform_create."""
    class Meta:
        model = Document
        fields = ['title', 'file', 'target']
        extra_kwargs = {
            'target': {'required': False},
        }


class DocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField()
    size = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='uploaded_at', read_only=True)
    remarks = DocumentRemarkSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'project', 'student', 'student_name', 'title',
            'file', 'file_url', 'size', 'version', 'status', 'target',
            'comment', 'supervisor_approved_for_jury', 'jury_confirmed', 'uploaded_at', 'created_at',
            'remarks',
        ]
        read_only_fields = ['project', 'student', 'student_name', 'size', 'supervisor_approved_for_jury', 'jury_confirmed', 'uploaded_at']

    def get_file_url(self, obj):
        if not obj.file:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.file.url)
        from django.conf import settings
        base = getattr(settings, 'SITE_URL', 'http://localhost:8000')
        return f'{base}{obj.file.url}'


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
        extra_kwargs = {
            'project': {'required': False},
            'student': {'required': False},
        }


class EvaluationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    student_name = serializers.CharField(source='project.student.name', read_only=True)
    supervisor_scored = serializers.SerializerMethodField()
    jury_scored = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = [
            'id', 'project', 'project_title', 'student_name',
            'supervisor_score', 'jury_score',
            'supervisor_comment', 'jury_comment',
            'supervisor_criteria', 'jury_criteria',
            'supervisor_weight', 'jury_weight',
            'is_published', 'created_at', 'updated_at',
            'supervisor_scored', 'jury_scored',
        ]

    def get_supervisor_scored(self, obj):
        return obj.supervisor_score is not None

    def get_jury_scored(self, obj):
        return obj.jury_score is not None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            if request.user.role == 'student' and not instance.is_published:
                data['supervisor_score'] = None
                data['jury_score'] = None
                data['supervisor_comment'] = None
                data['jury_comment'] = None
        return data


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


class ProjectDashboardSerializer(ProjectListSerializer):
    """Full project data returned by the student dashboard endpoint."""
    documents = DocumentSerializer(many=True, read_only=True)
    appointments = AppointmentSerializer(many=True, read_only=True)
    feedbacks = FeedbackSerializer(many=True, read_only=True)
    evaluation = EvaluationSerializer(read_only=True)
    jury_assignments = JuryAssignmentSerializer(many=True, read_only=True)

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            'documents', 'appointments', 'feedbacks', 'evaluation', 'jury_assignments',
        ]
