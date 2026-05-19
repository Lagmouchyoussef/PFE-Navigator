from rest_framework import serializers
from apps.common.models import Project, Document, DocumentRemark, Milestone, Appointment, Feedback, Evaluation
from apps.authentication.models import User


class SupervisorStudentSerializer(serializers.ModelSerializer):
    project_title  = serializers.SerializerMethodField()
    project_status = serializers.SerializerMethodField()
    project_id     = serializers.SerializerMethodField()
    progress       = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'institutional_id', 'department',
            'project_id', 'project_title', 'project_status', 'progress',
        ]

    def get_project_id(self, obj):
        try:
            return obj.project.id
        except Exception:
            return None

    def get_project_title(self, obj):
        try:
            return obj.project.title
        except Exception:
            return None

    def get_project_status(self, obj):
        try:
            return obj.project.status
        except Exception:
            return None

    def get_progress(self, obj):
        try:
            milestones = obj.project.milestones.all()
            if not milestones:
                return 0
            completed = milestones.filter(status='completed').count()
            return round((completed / milestones.count()) * 100)
        except Exception:
            return 0


class SupervisorProjectSerializer(serializers.ModelSerializer):
    student_name      = serializers.CharField(source='student.name',  read_only=True)
    student_email     = serializers.CharField(source='student.email', read_only=True)
    subject_title     = serializers.CharField(source='subject.title', read_only=True)
    document_count    = serializers.SerializerMethodField()
    pending_documents = serializers.SerializerMethodField()
    progress          = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'start_date', 'end_date',
            'student_name', 'student_email', 'subject_title',
            'document_count', 'pending_documents', 'progress',
            'created_at', 'updated_at',
        ]

    def get_document_count(self, obj):
        return obj.documents.count()

    def get_pending_documents(self, obj):
        return obj.documents.filter(status='pending', target='supervisor').count()

    def get_progress(self, obj):
        milestones = obj.milestones.all()
        if not milestones:
            return 0
        completed = milestones.filter(status='completed').count()
        return round((completed / milestones.count()) * 100)


class SupervisorDocumentSerializer(serializers.ModelSerializer):
    student_name  = serializers.CharField(source='student.name',  read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    size          = serializers.ReadOnlyField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'version', 'status', 'target', 'comment',
            'uploaded_at', 'size', 'student_name', 'project_title',
            'supervisor_approved_for_jury', 'jury_confirmed',
        ]
        read_only_fields = ['file', 'version', 'uploaded_at', 'size', 'jury_confirmed']


class DocumentRemarkSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = DocumentRemark
        fields = ['id', 'comment', 'score', 'author_name', 'created_at']
        read_only_fields = ['author_name', 'created_at']


class SupervisorMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'project', 'title', 'description', 'status', 'date', 'order']


class SupervisorAppointmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'date', 'time', 'location', 'type',
            'status', 'notes', 'student_name', 'created_at',
        ]


class SupervisorFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'title', 'comment', 'created_at']
        read_only_fields = ['created_at']


class SupervisorEvaluationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title',        read_only=True)
    student_name  = serializers.CharField(source='project.student.name', read_only=True)
    student_id    = serializers.IntegerField(source='project.student.id', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'project', 'project_title', 'student_name', 'student_id',
            'supervisor_score', 'supervisor_comment', 'supervisor_criteria',
            'jury_score',       'jury_comment',       'jury_criteria',
            'supervisor_weight', 'jury_weight',
            'is_published', 'created_at', 'updated_at',
        ]
        read_only_fields = ['project_title', 'student_name', 'student_id', 'created_at', 'updated_at']
