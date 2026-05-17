from rest_framework import serializers
from apps.common.models import Project, Document, DocumentRemark, Evaluation


class JuryProjectSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    subject_title = serializers.CharField(source='subject.title', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status',
            'student_name', 'supervisor_name', 'subject_title',
            'start_date', 'end_date',
        ]


class JuryDocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    size = serializers.ReadOnlyField()

    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'version', 'uploaded_at', 'size', 'student_name']


class DocumentRemarkSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = DocumentRemark
        fields = ['id', 'comment', 'score', 'author_name', 'created_at']
        read_only_fields = ['author_name', 'created_at']


class JuryEvaluationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    student_name = serializers.CharField(source='project.student.name', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'project_title', 'student_name',
            'jury_score', 'jury_comment', 'jury_criteria',
            'jury_weight', 'is_published',
        ]
        read_only_fields = ['project_title', 'student_name', 'is_published']
