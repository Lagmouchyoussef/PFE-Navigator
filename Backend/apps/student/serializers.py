from rest_framework import serializers
from apps.common.models import (
    Project, Document, Milestone, Appointment, Evaluation, Feedback, Subject,
)
from apps.authentication.models import User


# ── STUDENT-FACING SERIALIZERS ────────────────────────────────────────────────

class StudentSubjectSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'title', 'description', 'year', 'status', 'supervisor_name']


class StudentMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'title', 'description', 'status', 'date', 'order']


class StudentDocumentSerializer(serializers.ModelSerializer):
    size = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_url', 'version', 'status', 'target',
            'comment', 'uploaded_at', 'size',
        ]
        read_only_fields = ['version', 'status', 'comment', 'uploaded_at', 'size']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def create(self, validated_data):
        project = self.context['project']
        student = self.context['request'].user
        existing = Document.objects.filter(
            project=project, title=validated_data['title']
        ).order_by('-version').first()
        version = (existing.version + 1) if existing else 1
        return Document.objects.create(
            project=project, student=student, version=version, **validated_data
        )


class StudentAppointmentSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'date', 'time', 'location', 'type',
            'status', 'notes', 'supervisor_name', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']


class StudentEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = [
            'id', 'supervisor_score', 'jury_score', 'supervisor_comment',
            'jury_comment', 'supervisor_weight', 'jury_weight', 'is_published',
            'supervisor_scored', 'jury_scored',
        ]

    supervisor_scored = serializers.SerializerMethodField()
    jury_scored = serializers.SerializerMethodField()

    def get_supervisor_scored(self, obj):
        return obj.supervisor_score is not None

    def get_jury_scored(self, obj):
        return obj.jury_score is not None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not instance.is_published:
            data['supervisor_score'] = None
            data['jury_score'] = None
            data['supervisor_comment'] = ''
            data['jury_comment'] = ''
        return data


class StudentProjectSerializer(serializers.ModelSerializer):
    milestones   = StudentMilestoneSerializer(many=True, read_only=True)
    documents    = StudentDocumentSerializer(many=True, read_only=True)
    appointments = StudentAppointmentSerializer(many=True, read_only=True)
    evaluation   = StudentEvaluationSerializer(read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    subject_title   = serializers.CharField(source='subject.title',   read_only=True)
    progress        = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'start_date', 'end_date',
            'supervisor_name', 'subject_title', 'progress',
            'milestones', 'documents', 'appointments', 'evaluation',
            'created_at', 'updated_at',
        ]

    def get_progress(self, obj):
        milestones = obj.milestones.all()
        if not milestones:
            return 0
        completed = milestones.filter(status='completed').count()
        return round((completed / milestones.count()) * 100)


class StudentFeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'title', 'comment', 'author_name', 'created_at']


# ── STUDENT DETAIL (for supervisor / admin access) ────────────────────────────

class StudentDetailMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'title', 'status', 'date', 'order']


class StudentDetailDocumentSerializer(serializers.ModelSerializer):
    size = serializers.ReadOnlyField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_url', 'version',
            'status', 'target', 'comment', 'uploaded_at', 'size',
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class StudentDetailSerializer(serializers.ModelSerializer):
    project_id     = serializers.SerializerMethodField()
    project_title  = serializers.SerializerMethodField()
    project_status = serializers.SerializerMethodField()
    subject_title  = serializers.SerializerMethodField()
    progress       = serializers.SerializerMethodField()
    milestones     = serializers.SerializerMethodField()
    documents      = serializers.SerializerMethodField()
    evaluation     = serializers.SerializerMethodField()
    supervisor_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'institutional_id', 'department',
            'phone_number', 'is_active',
            'project_id', 'project_title', 'project_status', 'subject_title',
            'supervisor_name', 'progress', 'milestones', 'documents', 'evaluation',
        ]

    def _project(self, obj):
        try:
            return obj.project
        except Exception:
            return None

    def get_project_id(self, obj):
        p = self._project(obj)
        return p.id if p else None

    def get_project_title(self, obj):
        p = self._project(obj)
        return p.title if p else None

    def get_project_status(self, obj):
        p = self._project(obj)
        return p.status if p else None

    def get_subject_title(self, obj):
        p = self._project(obj)
        return p.subject.title if p and p.subject else None

    def get_supervisor_name(self, obj):
        p = self._project(obj)
        return p.supervisor.name if p and p.supervisor else None

    def get_progress(self, obj):
        p = self._project(obj)
        if not p:
            return 0
        milestones = p.milestones.all()
        if not milestones:
            return 0
        completed = milestones.filter(status='completed').count()
        return round((completed / milestones.count()) * 100)

    def get_milestones(self, obj):
        p = self._project(obj)
        if not p:
            return []
        return StudentDetailMilestoneSerializer(p.milestones.all(), many=True).data

    def get_documents(self, obj):
        p = self._project(obj)
        if not p:
            return []
        docs = p.documents.all()
        return StudentDetailDocumentSerializer(
            docs, many=True, context=self.context
        ).data

    def get_evaluation(self, obj):
        p = self._project(obj)
        if not p:
            return None
        try:
            ev = p.evaluation
            return StudentEvaluationSerializer(ev).data
        except Exception:
            return None
