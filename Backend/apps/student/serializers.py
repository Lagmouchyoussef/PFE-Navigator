from rest_framework import serializers
from apps.common.models import (
    Project, Document, Milestone, Appointment, Evaluation, Feedback, Subject,
)


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

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'version', 'status', 'target',
            'comment', 'uploaded_at', 'size',
        ]
        read_only_fields = ['version', 'status', 'comment', 'uploaded_at', 'size']

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
        ]


class StudentProjectSerializer(serializers.ModelSerializer):
    milestones = StudentMilestoneSerializer(many=True, read_only=True)
    documents = StudentDocumentSerializer(many=True, read_only=True)
    appointments = StudentAppointmentSerializer(many=True, read_only=True)
    evaluation = StudentEvaluationSerializer(read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    subject_title = serializers.CharField(source='subject.title', read_only=True)
    progress = serializers.SerializerMethodField()

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
