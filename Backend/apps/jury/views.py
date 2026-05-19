from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsJury
from apps.common.models import Project, Document, DocumentRemark, Evaluation, Appointment, JuryAssignment

from .serializers import (
    JuryProjectSerializer, JuryDocumentSerializer,
    DocumentRemarkSerializer, JuryEvaluationSerializer,
    JuryAppointmentSerializer,
)


class JuryProjectViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsJury]
    serializer_class = JuryProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(
            jury_assignments__jury_member=self.request.user
        ).distinct()


class JuryDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsJury]
    serializer_class = JuryDocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(
            project__jury_assignments__jury_member=self.request.user,
            target='jury',
            project__jury_documents_open=True,
        ).distinct()

    @action(detail=True, methods=['post'], url_path='confirm-receipt')
    def confirm_receipt(self, request, pk=None):
        document = self.get_object()
        document.jury_confirmed = True
        document.save()
        return Response(JuryDocumentSerializer(document, context={'request': request}).data)

    @action(detail=True, methods=['get', 'post'], url_path='remarks')
    def remarks(self, request, pk=None):
        document = self.get_object()
        if request.method == 'GET':
            return Response(DocumentRemarkSerializer(document.remarks.all(), many=True).data)
        serializer = DocumentRemarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(document=document, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class JuryEvaluationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsJury]
    serializer_class = JuryEvaluationSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Evaluation.objects.filter(
            project__jury_assignments__jury_member=self.request.user
        ).distinct()

    def partial_update(self, request, *args, **kwargs):
        evaluation = self.get_object()
        allowed = {'jury_score', 'jury_comment', 'jury_criteria'}
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
        evaluation.jury_score = float(score)
        evaluation.jury_comment = comment
        if criteria:
            evaluation.jury_criteria = criteria
        evaluation.save()
        return Response(JuryEvaluationSerializer(evaluation).data)


class JuryAppointmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Jury members can see all appointments for their assigned projects.
    They can also confirm or cancel appointments.
    """
    permission_classes = [IsJury]
    serializer_class = JuryAppointmentSerializer

    def get_queryset(self):
        assigned_ids = JuryAssignment.objects.filter(
            jury_member=self.request.user
        ).values_list('project_id', flat=True)
        return Appointment.objects.filter(project_id__in=assigned_ids).order_by('date', 'time')

    @action(detail=True, methods=['post'], url_path='confirm')
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Confirmed'
        appointment.save()
        return Response(JuryAppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Cancelled'
        appointment.save()
        return Response(JuryAppointmentSerializer(appointment).data)


class JuryDashboardView(APIView):
    """Summary stats for the jury dashboard."""
    permission_classes = [IsJury]

    def get(self, request):
        assigned_project_ids = JuryAssignment.objects.filter(
            jury_member=request.user
        ).values_list('project_id', flat=True)

        projects = Project.objects.filter(id__in=assigned_project_ids)
        evaluations = Evaluation.objects.filter(project_id__in=assigned_project_ids)

        graded = evaluations.filter(jury_score__isnull=False).count()
        pending_grade = evaluations.filter(jury_score__isnull=True).count()

        appointments = Appointment.objects.filter(project_id__in=assigned_project_ids)

        return Response({
            'assigned_projects':   projects.count(),
            'evaluated':           graded,
            'pending_evaluation':  pending_grade,
            'appointments': {
                'total':     appointments.count(),
                'confirmed': appointments.filter(status='Confirmed').count(),
                'pending':   appointments.filter(status='Pending').count(),
            },
        })
