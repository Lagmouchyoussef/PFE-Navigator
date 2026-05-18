from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.common.models import (
    Subject, Project, Document, DocumentRemark,
    Milestone, Appointment, Evaluation, Feedback, JuryAssignment,
)
from .serializers import (
    SubjectSerializer, ProjectListSerializer, ProjectCreateSerializer,
    DocumentSerializer, DocumentRemarkSerializer, AppointmentSerializer,
    MilestoneSerializer, EvaluationSerializer, FeedbackSerializer,
    JuryAssignmentSerializer,
)


def get_user_projects(user):
    if user.role == 'admin':
        return Project.objects.all()
    elif user.role == 'supervisor':
        return Project.objects.filter(supervisor=user)
    elif user.role == 'jury':
        assigned_ids = JuryAssignment.objects.filter(jury_member=user).values_list('project_id', flat=True)
        return Project.objects.filter(id__in=assigned_ids)
    else:
        return Project.objects.filter(student=user)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_user_projects(self.request.user).select_related('student', 'supervisor', 'subject')

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ProjectCreateSerializer
        return ProjectListSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            serializer.save(student=user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        if request.user.role != 'student':
            return Response({'detail': 'Only students have a dashboard.'}, status=400)
        try:
            project = Project.objects.get(student=request.user)
        except Project.DoesNotExist:
            return Response({'detail': 'No project found.'}, status=404)
        return Response(ProjectListSerializer(project, context={'request': request}).data)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        projects = get_user_projects(request.user)
        status_counts = {
            item['status']: item['count']
            for item in projects.values('status').annotate(count=Count('id'))
        }
        return Response({
            'total': projects.count(),
            'by_status': status_counts,
        })


class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all()


class RepositoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(
            status__in=['completed', 'approved']
        ).select_related('student', 'supervisor', 'subject')
        return Response(ProjectListSerializer(projects, many=True, context={'request': request}).data)


class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentSerializer

    def get_queryset(self):
        project_ids = get_user_projects(self.request.user).values_list('id', flat=True)
        return Document.objects.filter(project_id__in=project_ids).select_related('student', 'project')

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            try:
                project = Project.objects.get(student=user)
            except Project.DoesNotExist:
                raise ValidationError({'detail': 'No project found for this student.'})
            serializer.save(student=user, project=project)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        doc = self.get_object()
        doc.status = 'approved'
        doc.save()
        return Response(DocumentSerializer(doc, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        doc = self.get_object()
        doc.status = 'rejected'
        doc.comment = request.data.get('reason', '')
        doc.save()
        return Response(DocumentSerializer(doc, context={'request': request}).data)


class DocumentRemarkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentRemarkSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        project_ids = get_user_projects(self.request.user).values_list('id', flat=True)
        return DocumentRemark.objects.filter(
            document__project_id__in=project_ids
        ).select_related('author', 'document')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        project_ids = get_user_projects(self.request.user).values_list('id', flat=True)
        return Appointment.objects.filter(project_id__in=project_ids).select_related('student', 'supervisor', 'project')

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            try:
                project = Project.objects.get(student=user)
                serializer.save(
                    student=user,
                    project=project,
                    supervisor=project.supervisor,
                )
            except Project.DoesNotExist:
                raise ValidationError({'detail': 'No project found for this student.'})
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Cancelled'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Confirmed'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)


class MilestoneViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MilestoneSerializer

    def get_queryset(self):
        project_ids = get_user_projects(self.request.user).values_list('id', flat=True)
        return Milestone.objects.filter(project_id__in=project_ids)


class EvaluationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EvaluationSerializer

    def get_queryset(self):
        project_ids = get_user_projects(self.request.user).values_list('id', flat=True)
        return Evaluation.objects.filter(project_id__in=project_ids).select_related('project__student')

    @action(detail=True, methods=['post'], url_path='submit_supervisor')
    def submit_supervisor(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.supervisor_score = request.data.get('score')
        evaluation.supervisor_comment = request.data.get('comment', '')
        evaluation.supervisor_criteria = request.data.get('criteria')
        evaluation.save()
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'], url_path='submit_jury')
    def submit_jury(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.jury_score = request.data.get('score')
        evaluation.jury_comment = request.data.get('comment', '')
        evaluation.jury_criteria = request.data.get('criteria')
        evaluation.save()
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.is_published = True
        evaluation.save()
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'], url_path='update_weights')
    def update_weights(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.supervisor_weight = request.data.get('supervisor_weight', evaluation.supervisor_weight)
        evaluation.jury_weight = request.data.get('jury_weight', evaluation.jury_weight)
        evaluation.save()
        return Response(EvaluationSerializer(evaluation).data)


class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FeedbackSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        project_ids = get_user_projects(self.request.user).values_list('id', flat=True)
        return Feedback.objects.filter(project_id__in=project_ids).select_related('author', 'project')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class JuryAssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JuryAssignmentSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return JuryAssignment.objects.all().select_related('project', 'jury_member', 'project__student')
        elif user.role == 'jury':
            return JuryAssignment.objects.filter(jury_member=user).select_related('project', 'project__student')
        else:
            project_ids = get_user_projects(user).values_list('id', flat=True)
            return JuryAssignment.objects.filter(project_id__in=project_ids).select_related('project', 'jury_member', 'project__student')


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role_counts = {
            item['role']: item['count']
            for item in User.objects.values('role').annotate(count=Count('id'))
        }
        project_counts = {
            item['status']: item['count']
            for item in Project.objects.values('status').annotate(count=Count('id'))
        }
        return Response({
            'users': {
                'total': User.objects.count(),
                'students': role_counts.get('student', 0),
                'supervisors': role_counts.get('supervisor', 0),
                'juries': role_counts.get('jury', 0),
                'admins': role_counts.get('admin', 0),
            },
            'projects': {
                'total': Project.objects.count(),
                **project_counts,
            },
            'subjects': {
                'total': Subject.objects.count(),
                'available': Subject.objects.filter(status='available').count(),
                'taken': Subject.objects.filter(status='taken').count(),
            },
        })
