from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.authentication.permissions import IsStudent, IsAdminOrSupervisor
from apps.common.models import Project, Document, Milestone, Appointment, Subject, Feedback, Evaluation

from .serializers import (
    StudentProjectSerializer, StudentDocumentSerializer,
    StudentMilestoneSerializer, StudentAppointmentSerializer,
    StudentSubjectSerializer, StudentFeedbackSerializer,
    StudentEvaluationSerializer, StudentDetailSerializer,
    StudentDetailDocumentSerializer,
)


# ── STUDENT-FACING VIEWS ──────────────────────────────────────────────────────

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


class StudentEvaluationView(generics.ListAPIView):
    """Student reads their own evaluation (published only unless admin)."""
    permission_classes = [IsStudent]
    serializer_class = StudentEvaluationSerializer

    def get_queryset(self):
        try:
            project = Project.objects.get(student=self.request.user)
            return Evaluation.objects.filter(project=project, is_published=True)
        except Project.DoesNotExist:
            return Evaluation.objects.none()


# ── SUPERVISOR / ADMIN ACCESS TO INDIVIDUAL STUDENT DATA ─────────────────────

def _resolve_student(request, pk):
    """Return (student, error_response). Supervisor can only see their own students."""
    try:
        if request.user.role == 'supervisor':
            student = User.objects.get(
                pk=pk, role='student',
                project__supervisor=request.user,
            )
        else:
            student = User.objects.get(pk=pk, role='student')
        return student, None
    except User.DoesNotExist:
        return None, Response(
            {'detail': 'Student not found or access denied.'},
            status=status.HTTP_404_NOT_FOUND,
        )


class StudentByIdView(APIView):
    """
    GET /api/students/{id}/
    Returns full student detail including project, milestones, documents, evaluation.
    Accessible by: supervisor (own students only) and admin.
    """
    permission_classes = [IsAdminOrSupervisor]

    def get(self, request, pk):
        student, err = _resolve_student(request, pk)
        if err:
            return err
        serializer = StudentDetailSerializer(student, context={'request': request})
        return Response(serializer.data)


class StudentDocumentsByIdView(APIView):
    """
    GET /api/students/{id}/documents/
    Returns all documents submitted by the specified student.
    Accessible by: supervisor (own students only) and admin.
    """
    permission_classes = [IsAdminOrSupervisor]

    def get(self, request, pk):
        student, err = _resolve_student(request, pk)
        if err:
            return err
        documents = Document.objects.filter(student=student).order_by('-uploaded_at')
        serializer = StudentDetailDocumentSerializer(
            documents, many=True, context={'request': request}
        )
        return Response(serializer.data)


class StudentEvaluationByIdView(APIView):
    """
    GET  /api/students/{id}/evaluation/  → read evaluation
    PATCH /api/students/{id}/evaluation/ → update supervisor fields
    Accessible by: supervisor (own students only) and admin.
    """
    permission_classes = [IsAdminOrSupervisor]

    def _get_evaluation(self, student):
        try:
            return Evaluation.objects.get(project__student=student), None
        except Evaluation.DoesNotExist:
            return None, Response(
                {'detail': 'No evaluation found for this student.'},
                status=status.HTTP_404_NOT_FOUND,
            )

    def get(self, request, pk):
        student, err = _resolve_student(request, pk)
        if err:
            return err
        evaluation, err = self._get_evaluation(student)
        if err:
            return err
        return Response(StudentEvaluationSerializer(evaluation).data)

    def patch(self, request, pk):
        student, err = _resolve_student(request, pk)
        if err:
            return err
        evaluation, err = self._get_evaluation(student)
        if err:
            return err

        if request.user.role == 'supervisor':
            allowed_fields = {'supervisor_score', 'supervisor_comment', 'supervisor_criteria'}
        else:
            allowed_fields = {
                'supervisor_score', 'supervisor_comment', 'supervisor_criteria',
                'jury_score', 'jury_comment', 'jury_criteria',
                'supervisor_weight', 'jury_weight',
            }

        data = {k: v for k, v in request.data.items() if k in allowed_fields}
        serializer = StudentEvaluationSerializer(evaluation, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
