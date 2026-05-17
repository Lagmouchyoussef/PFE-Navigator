from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.authentication.models import User
from apps.authentication.permissions import IsSupervisor
from apps.common.models import Project, Document, DocumentRemark, Milestone, Appointment, Feedback

from .serializers import (
    SupervisorStudentSerializer, SupervisorProjectSerializer,
    SupervisorDocumentSerializer, DocumentRemarkSerializer,
    SupervisorMilestoneSerializer, SupervisorAppointmentSerializer,
    SupervisorFeedbackSerializer,
)


class SupervisorStudentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorStudentSerializer

    def get_queryset(self):
        return User.objects.filter(
            role='student',
            project__supervisor=self.request.user,
        )


class SupervisorProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorProjectSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Project.objects.filter(supervisor=self.request.user)

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        project = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Project.STATUS_CHOICES):
            return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        project.status = new_status
        project.save()
        return Response(SupervisorProjectSerializer(project).data)


class SupervisorDocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorDocumentSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Document.objects.filter(
            project__supervisor=self.request.user,
            target='supervisor',
        )

    @action(detail=True, methods=['patch'], url_path='review')
    def review(self, request, pk=None):
        document = self.get_object()
        new_status = request.data.get('status')
        comment = request.data.get('comment', '')
        if new_status not in ('approved', 'rejected'):
            return Response({'detail': 'Status must be approved or rejected.'}, status=400)
        document.status = new_status
        document.comment = comment
        document.save()
        return Response(SupervisorDocumentSerializer(document).data)

    @action(detail=True, methods=['get', 'post'], url_path='remarks')
    def remarks(self, request, pk=None):
        document = self.get_object()
        if request.method == 'GET':
            return Response(DocumentRemarkSerializer(document.remarks.all(), many=True).data)
        serializer = DocumentRemarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(document=document, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SupervisorMilestoneViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorMilestoneSerializer

    def get_queryset(self):
        return Milestone.objects.filter(project__supervisor=self.request.user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('project')
        project = Project.objects.get(id=project_id, supervisor=self.request.user)
        serializer.save(project=project)


class SupervisorAppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorAppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(supervisor=self.request.user)

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        appointment = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Appointment.STATUS_CHOICES):
            return Response({'detail': 'Invalid status.'}, status=400)
        appointment.status = new_status
        appointment.save()
        return Response(SupervisorAppointmentSerializer(appointment).data)


class SupervisorFeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorFeedbackSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        return Feedback.objects.filter(
            project__supervisor=self.request.user,
            author=self.request.user,
        )

    def perform_create(self, serializer):
        project_id = self.request.data.get('project')
        project = Project.objects.get(id=project_id, supervisor=self.request.user)
        serializer.save(author=self.request.user, project=project)
