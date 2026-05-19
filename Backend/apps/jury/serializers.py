from rest_framework import serializers
from apps.common.models import Project, Document, DocumentRemark, Evaluation, Appointment


class JuryProjectSerializer(serializers.ModelSerializer):
    student_name    = serializers.CharField(source='student.name',    read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    subject_title   = serializers.CharField(source='subject.title',   read_only=True)
    progress        = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status',
            'student_name', 'supervisor_name', 'subject_title',
            'start_date', 'end_date', 'progress',
        ]

    def get_progress(self, obj):
        milestones = obj.milestones.all()
        if not milestones:
            return 0
        completed = milestones.filter(status='completed').count()
        return round((completed / milestones.count()) * 100)


class JuryDocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    size         = serializers.ReadOnlyField()
    file_url     = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'file_url', 'version', 'status',
                  'uploaded_at', 'size', 'student_name',
                  'supervisor_approved_for_jury', 'jury_confirmed']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class DocumentRemarkSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = DocumentRemark
        fields = ['id', 'comment', 'score', 'author_name', 'created_at']
        read_only_fields = ['author_name', 'created_at']


class JuryEvaluationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title',        read_only=True)
    student_name  = serializers.CharField(source='project.student.name', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'project', 'project_title', 'student_name',
            'jury_score', 'jury_comment', 'jury_criteria',
            'jury_weight', 'is_published',
        ]
        read_only_fields = ['project_title', 'student_name', 'is_published']


class JuryAppointmentSerializer(serializers.ModelSerializer):
    student_name    = serializers.CharField(source='student.name',    read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    project_title   = serializers.CharField(source='project.title',   read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'date', 'time', 'location', 'type',
            'status', 'notes',
            'student_name', 'supervisor_name', 'project_title',
            'created_at',
        ]
        read_only_fields = ['created_at']
