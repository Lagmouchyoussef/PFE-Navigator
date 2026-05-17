from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsStudent
from apps.common.models import Project, Document, Milestone, Appointment, Subject, Feedback

from .serializers import (
    StudentProjectSerializer, StudentDocumentSerializer,
    StudentMilestoneSerializer, StudentAppointmentSerializer,
    StudentSubjectSerializer, StudentFeedbackSerializer,
)


class StudentProjectView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        try:
            project = Project.objects.get(student=request.user)
        except Project.DoesNotExist:
            return Response({'detail': 'No project found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(StudentProjectSerializer(project).data)


class StudentSubjectListView(generics.ListAPIView):
    permission_classes = [IsStudent]
    serializer_class = StudentSubjectSerializer
    queryset = Subject.objects.filter(status='available')


class StudentDocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsStudent]
    serializer_class = StudentDocumentSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        return Document.objects.filter(student=self.request.user)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        try:
            ctx['project'] = Project.objects.get(student=self.request.user)
        except Project.DoesNotExist:
            pass
        return ctx


class StudentMilestoneViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsStudent]
    serializer_class = StudentMilestoneSerializer

    def get_queryset(self):
        try:
            project = Project.objects.get(student=self.request.user)
            return project.milestones.all()
        except Project.DoesNotExist:
            return Milestone.objects.none()


class StudentAppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsStudent]
    serializer_class = StudentAppointmentSerializer
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return Appointment.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        project = Project.objects.get(student=self.request.user)
        serializer.save(
            student=self.request.user,
            project=project,
            supervisor=project.supervisor,
        )


class StudentFeedbackView(generics.ListAPIView):
    permission_classes = [IsStudent]
    serializer_class = StudentFeedbackSerializer

    def get_queryset(self):
        try:
            project = Project.objects.get(student=self.request.user)
            return project.feedbacks.all()
        except Project.DoesNotExist:
            return Feedback.objects.none()
