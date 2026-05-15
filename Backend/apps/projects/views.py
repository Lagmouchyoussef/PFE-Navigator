"""Views for the projects application."""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Project, ProjectMilestone, Document, Appointment, Evaluation, Feedback
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer, ProjectMilestoneSerializer,
    DocumentSerializer, AppointmentSerializer, EvaluationSerializer, FeedbackSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for project operations."""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return Project.objects.filter(student=user.student_profile)
        elif user.role == 'supervisor':
            return Project.objects.filter(supervisor=user)
        return super().get_queryset()

    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'dashboard':
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Returns the main project for the logged-in student with all details."""
        if not hasattr(request.user, 'student_profile'):
            return Response({"error": "Only students have a project dashboard."}, status=status.HTTP_403_FORBIDDEN)
        
        project = Project.objects.filter(student=request.user.student_profile).first()
        if not project:
            return Response({"message": "No project assigned."}, status=status.HTTP_200_OK)
            
        serializer = ProjectDetailSerializer(project)
        return Response(serializer.data)


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return Document.objects.filter(project__student=user.student_profile)
        return super().get_queryset()

    def perform_create(self, serializer):
        # Auto-assign the document to the student's project
        if hasattr(self.request.user, 'student_profile'):
            project = Project.objects.filter(student=self.request.user.student_profile).first()
            if project:
                serializer.save(project=project)
            else:
                raise serializers.ValidationError("Student has no project.")
        else:
            serializer.save()


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return Appointment.objects.filter(project__student=user.student_profile)
        return super().get_queryset()


class MilestoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjectMilestone.objects.all()
    serializer_class = ProjectMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return ProjectMilestone.objects.filter(project__student=user.student_profile)
        return super().get_queryset()


class EvaluationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            # Only show published evaluations to students
            return Evaluation.objects.filter(project__student=user.student_profile, is_published=True)
        return super().get_queryset()


class ProjectSubjectsView(APIView):
    """API view to list all project subjects/topics."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Return list of project subjects."""
        subjects = [
            {"id": 1, "name": "Artificial Intelligence"},
            {"id": 2, "name": "Web Development"},
            {"id": 3, "name": "Mobile Development"},
            {"id": 4, "name": "Cloud Computing"},
            {"id": 5, "name": "Data Science"},
            {"id": 6, "name": "Cybersecurity"},
            {"id": 7, "name": "IoT & Embedded Systems"},
            {"id": 8, "name": "Software Engineering"},
        ]
        return Response(subjects)


class ProjectRepositoryView(APIView):
    """API view to list project documents/repository."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Return list of project documents from repository."""
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
