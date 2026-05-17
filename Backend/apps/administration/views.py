from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.authentication.permissions import IsAdmin
from apps.common.models import Project, Subject, Evaluation, Resource, AdminNote, JuryAssignment

from .serializers import (
    AdminUserSerializer, AdminUserCreateSerializer,
    AdminSubjectSerializer, AdminProjectSerializer,
    AdminEvaluationSerializer, JuryAssignmentSerializer,
    AdminResourceSerializer, AdminNoteSerializer,
)


class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminUserCreateSerializer
        return AdminUserSerializer

    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password or len(new_password) < 8:
            return Response({'detail': 'Password must be at least 8 characters.'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password reset successfully.'})


class AdminSubjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = Subject.objects.all()
    serializer_class = AdminSubjectSerializer


class AdminProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = Project.objects.select_related('student', 'supervisor', 'subject')
    serializer_class = AdminProjectSerializer

    @action(detail=True, methods=['post'], url_path='assign-supervisor')
    def assign_supervisor(self, request, pk=None):
        project = self.get_object()
        supervisor_id = request.data.get('supervisor_id')
        try:
            supervisor = User.objects.get(id=supervisor_id, role='supervisor')
        except User.DoesNotExist:
            return Response({'detail': 'Supervisor not found.'}, status=404)
        project.supervisor = supervisor
        project.save()
        return Response(AdminProjectSerializer(project).data)


class AdminEvaluationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = Evaluation.objects.select_related('project__student')
    serializer_class = AdminEvaluationSerializer

    @action(detail=True, methods=['post'], url_path='publish')
    def publish(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.is_published = True
        evaluation.save()
        return Response(AdminEvaluationSerializer(evaluation).data)


class AdminJuryAssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = JuryAssignment.objects.select_related('project', 'jury_member')
    serializer_class = JuryAssignmentSerializer


class AdminResourceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = Resource.objects.all()
    serializer_class = AdminResourceSerializer

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class AdminNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = AdminNote.objects.all()
    serializer_class = AdminNoteSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

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
