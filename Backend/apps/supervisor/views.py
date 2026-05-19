from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.authentication.permissions import IsSupervisor
from apps.common.models import (
    Project, Document, Milestone, Appointment, Feedback, Evaluation,
)

from .serializers import (
    SupervisorStudentSerializer, SupervisorProjectSerializer,
    SupervisorDocumentSerializer, DocumentRemarkSerializer,
    SupervisorMilestoneSerializer, SupervisorAppointmentSerializer,
    SupervisorFeedbackSerializer, SupervisorEvaluationSerializer,
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

    @action(detail=True, methods=['post'], url_path='approve-for-jury')
    def approve_for_jury(self, request, pk=None):
        document = self.get_object()
        document.supervisor_approved_for_jury = True
        document.status = 'approved'
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

    @action(detail=True, methods=['post'], url_path='confirm')
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Confirmed'
        appointment.save()
        return Response(SupervisorAppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Cancelled'
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


class SupervisorEvaluationViewSet(viewsets.ModelViewSet):
    """Supervisor submits/reads evaluation scores for their students."""
    permission_classes = [IsSupervisor]
    serializer_class = SupervisorEvaluationSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Evaluation.objects.filter(
            project__supervisor=self.request.user
        ).select_related('project__student')

    def partial_update(self, request, *args, **kwargs):
        evaluation = self.get_object()
        allowed = {'supervisor_score', 'supervisor_comment', 'supervisor_criteria',
                   'supervisor_weight', 'jury_weight'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        serializer = self.get_serializer(evaluation, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        evaluation = self.get_object()
        score = request.data.get('score')
        comment = request.data.get('comment', '')
        criteria = request.data.get('criteria')
        if score is None:
            return Response({'detail': 'Score is required.'}, status=400)
        evaluation.supervisor_score = float(score)
        evaluation.supervisor_comment = comment
        if criteria:
            evaluation.supervisor_criteria = criteria
        evaluation.save()
        return Response(SupervisorEvaluationSerializer(evaluation).data)


class SupervisorDashboardView(APIView):
    """Aggregated stats for the supervisor dashboard."""
    permission_classes = [IsSupervisor]

    def get(self, request):
        projects = Project.objects.filter(supervisor=request.user)
        total = projects.count()

        status_counts = {
            item['status']: item['count']
            for item in projects.values('status').annotate(count=Count('id'))
        }

        student_ids = projects.values_list('student_id', flat=True)
        students_count = User.objects.filter(id__in=student_ids, role='student').count()

        pending_docs = Document.objects.filter(
            project__supervisor=request.user,
            status='pending',
            target='supervisor',
        ).count()

        pending_appts = Appointment.objects.filter(
            supervisor=request.user,
            status='Pending',
        ).count()

        completed = status_counts.get('completed', 0)
        in_progress = status_counts.get('in_progress', 0)

        return Response({
            'projects': {
                'total':       total,
                'in_progress': in_progress,
                'completed':   completed,
                'by_status':   status_counts,
            },
            'students':         students_count,
            'pending_documents': pending_docs,
            'pending_appointments': pending_appts,
        })
