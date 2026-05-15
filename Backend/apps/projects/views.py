"""Views for the projects application."""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import (
    Project, ProjectMilestone, Document, DocumentRemark,
    Appointment, Evaluation, Feedback, JuryAssignment
)
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer, ProjectMilestoneSerializer,
    DocumentSerializer, DocumentRemarkSerializer, AppointmentSerializer,
    EvaluationSerializer, FeedbackSerializer, JuryAssignmentSerializer
)

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for project operations."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['retrieve', 'dashboard']:
            return ProjectDetailSerializer
        return ProjectSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                return Project.objects.filter(student=user.student_profile).select_related('student__user', 'supervisor')
            return Project.objects.none()
        elif user.role == 'supervisor':
            return Project.objects.filter(supervisor=user).select_related('student__user', 'supervisor')
        elif user.role == 'jury':
            return Project.objects.filter(jury_assignments__jury_member=user).select_related('student__user', 'supervisor')
        return Project.objects.all().select_related('student__user', 'supervisor')

    def perform_create(self, serializer):
        if self.request.user.role == 'student' and hasattr(self.request.user, 'student_profile'):
            serializer.save(student=self.request.user.student_profile)
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Returns the main project for the logged-in student."""
        if request.user.role != 'student' or not hasattr(request.user, 'student_profile'):
            return Response({"error": "Only students have a project dashboard."}, status=status.HTTP_403_FORBIDDEN)
        project = Project.objects.filter(student=request.user.student_profile).first()
        if not project:
            return Response({"message": "No project assigned."}, status=status.HTTP_200_OK)
        serializer = ProjectDetailSerializer(project, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Project statistics for admin/supervisor."""
        user = request.user
        qs = self.get_queryset()
        return Response({
            'total': qs.count(),
            'draft': qs.filter(status='draft').count(),
            'in_progress': qs.filter(status='in_progress').count(),
            'completed': qs.filter(status='completed').count(),
            'submitted': qs.filter(status='submitted').count(),
        })


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for document operations."""
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return DocumentSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                return Document.objects.filter(
                    project__student=user.student_profile
                ).prefetch_related('remarks__author').select_related('project__student__user')
            return Document.objects.none()
        elif user.role == 'supervisor':
            return Document.objects.filter(
                project__supervisor=user, target__in=['supervisor', 'administration']
            ).prefetch_related('remarks__author').select_related('project__student__user')
        elif user.role == 'jury':
            return Document.objects.filter(
                project__jury_assignments__jury_member=user, target__in=['jury', 'administration']
            ).prefetch_related('remarks__author').select_related('project__student__user')
        # Admin sees all
        return Document.objects.all().prefetch_related('remarks__author').select_related('project__student__user')

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student' and hasattr(user, 'student_profile'):
            project = Project.objects.filter(student=user.student_profile).first()
            if not project:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Student has no project.")
            # Auto-increment version for same title
            title = serializer.validated_data.get('title', '')
            existing = Document.objects.filter(project=project, title=title).count()
            serializer.save(project=project, version=existing + 1)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        doc = self.get_object()
        if request.user.role not in ['supervisor', 'admin']:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        doc.status = 'approved'
        doc.rejection_reason = ''
        doc.save()
        # Notify student
        self._notify_student(doc, 'approved', f'Your document "{doc.title}" has been approved.')
        return Response(DocumentSerializer(doc, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        doc = self.get_object()
        if request.user.role not in ['supervisor', 'admin']:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        reason = request.data.get('reason', '')
        doc.status = 'rejected'
        doc.rejection_reason = reason
        doc.save()
        self._notify_student(doc, 'rejected', f'Your document "{doc.title}" was rejected: {reason}')
        return Response(DocumentSerializer(doc, context={'request': request}).data)

    def _notify_student(self, doc, ntype, message):
        from apps.communications.models import Notification
        student_user = doc.project.student.user
        Notification.objects.create(
            recipient=student_user,
            sender=self.request.user,
            title=f'Document {ntype.capitalize()}',
            message=message,
            type=ntype,
            link='/student/reports',
        )


class DocumentRemarkViewSet(viewsets.ModelViewSet):
    """Remarks on documents by jury/supervisor."""
    serializer_class = DocumentRemarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return DocumentRemark.objects.filter(document__project__student=user.student_profile)
        elif user.role == 'supervisor':
            return DocumentRemark.objects.filter(document__project__supervisor=user)
        elif user.role == 'jury':
            return DocumentRemark.objects.filter(document__project__jury_assignments__jury_member=user)
        return DocumentRemark.objects.all()

    def perform_create(self, serializer):
        if self.request.user.role not in ['supervisor', 'jury', 'admin']:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only supervisors, jury or admin can add remarks.")
        remark = serializer.save(author=self.request.user)
        # Notify student
        from apps.communications.models import Notification
        student_user = remark.document.project.student.user
        Notification.objects.create(
            recipient=student_user,
            sender=self.request.user,
            title=f'New remark on "{remark.document.title}"',
            message=remark.comment[:200],
            type='document',
            link='/student/reports',
        )


class AppointmentViewSet(viewsets.ModelViewSet):
    """Appointments/calendar events."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                return Appointment.objects.filter(project__student=user.student_profile)
            return Appointment.objects.none()
        elif user.role == 'supervisor':
            return Appointment.objects.filter(project__supervisor=user)
        elif user.role == 'jury':
            return Appointment.objects.filter(project__jury_assignments__jury_member=user)
        return Appointment.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        appt = serializer.save(created_by=user)
        # Notify student if supervisor/admin creates appointment
        if user.role in ['supervisor', 'admin', 'jury'] and appt.project:
            from apps.communications.models import Notification
            student_user = appt.project.student.user
            Notification.objects.create(
                recipient=student_user,
                sender=user,
                title=f'New appointment: {appt.title}',
                message=f'Scheduled for {appt.date} at {appt.time}',
                type='defense' if appt.type == 'defense' else 'info',
                link='/student/schedule',
            )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appt = self.get_object()
        appt.status = 'cancelled'
        appt.save()
        return Response(AppointmentSerializer(appt).data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appt = self.get_object()
        appt.status = 'confirmed'
        appt.save()
        return Response(AppointmentSerializer(appt).data)


class MilestoneViewSet(viewsets.ModelViewSet):
    """Project milestones."""
    serializer_class = ProjectMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                return ProjectMilestone.objects.filter(project__student=user.student_profile)
            return ProjectMilestone.objects.none()
        elif user.role == 'supervisor':
            return ProjectMilestone.objects.filter(project__supervisor=user)
        return ProjectMilestone.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if self.request.user.role not in ['supervisor', 'admin']:
                self.permission_denied(self.request, message="Only supervisors can manage milestones.")
        return super().get_permissions()


STUDENT_EVAL_LINK = '/student/evaluation'


class EvaluationViewSet(viewsets.ModelViewSet):
    """Project evaluations."""
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                return Evaluation.objects.filter(
                    project__student=user.student_profile, is_published=True
                )
            return Evaluation.objects.none()
        elif user.role == 'supervisor':
            return Evaluation.objects.filter(project__supervisor=user)
        elif user.role == 'jury':
            return Evaluation.objects.filter(project__jury_assignments__jury_member=user)
        return Evaluation.objects.all()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'])
    def submit_supervisor(self, request, pk=None):
        """Supervisor submits their score."""
        if request.user.role != 'supervisor':
            return Response({'error': 'Only supervisors can submit supervisor scores.'}, status=403)
        evaluation = self.get_object()
        score = request.data.get('score')
        comment = request.data.get('comment', '')
        criteria = request.data.get('criteria', {})
        if score is not None:
            evaluation.supervisor_score = float(score)
            evaluation.supervisor_comment = comment
            evaluation.supervisor_criteria = criteria
            evaluation.save()
            # Notify student
            from apps.communications.models import Notification
            Notification.objects.create(
                recipient=evaluation.project.student.user,
                sender=request.user,
                title='Supervisor evaluation submitted',
                message='Your supervisor has submitted an evaluation for your project.',
                type='grade',
                link=STUDENT_EVAL_LINK,
            )
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'])
    def submit_jury(self, request, pk=None):
        """Jury member submits their score."""
        if request.user.role != 'jury':
            return Response({'error': 'Only jury members can submit jury scores.'}, status=403)
        evaluation = self.get_object()
        score = request.data.get('score')
        comment = request.data.get('comment', '')
        criteria = request.data.get('criteria', {})
        if score is not None:
            evaluation.jury_score = float(score)
            evaluation.jury_comment = comment
            evaluation.jury_criteria = criteria
            evaluation.save()
            from apps.communications.models import Notification
            Notification.objects.create(
                recipient=evaluation.project.student.user,
                sender=request.user,
                title='Jury evaluation submitted',
                message='The jury has submitted an evaluation for your project.',
                type='grade',
                link=STUDENT_EVAL_LINK,
            )
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Admin publishes the evaluation."""
        if request.user.role != 'admin':
            return Response({'error': 'Only admin can publish evaluations.'}, status=403)
        evaluation = self.get_object()
        evaluation.is_published = True
        evaluation.save()
        from apps.communications.models import Notification
        Notification.objects.create(
            recipient=evaluation.project.student.user,
            sender=request.user,
            title='Final grades published',
            message='Your final PFE grades have been officially published.',
            type='grade',
            link=STUDENT_EVAL_LINK,
        )
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'])
    def update_weights(self, request, pk=None):
        """Admin updates grading weights."""
        if request.user.role != 'admin':
            return Response({'error': 'Only admin can update weights.'}, status=403)
        evaluation = self.get_object()
        sup_w = request.data.get('supervisor_weight', evaluation.supervisor_weight)
        jury_w = request.data.get('jury_weight', evaluation.jury_weight)
        evaluation.supervisor_weight = sup_w
        evaluation.jury_weight = jury_w
        evaluation.save()
        return Response(EvaluationSerializer(evaluation).data)


class FeedbackViewSet(viewsets.ModelViewSet):
    """Feedback from supervisors/jury."""
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                return Feedback.objects.filter(project__student=user.student_profile)
            return Feedback.objects.none()
        elif user.role == 'supervisor':
            return Feedback.objects.filter(project__supervisor=user)
        return Feedback.objects.all()

    def perform_create(self, serializer):
        feedback = serializer.save(author=self.request.user)
        from apps.communications.models import Notification
        Notification.objects.create(
            recipient=feedback.project.student.user,
            sender=self.request.user,
            title=f'New feedback: {feedback.title}',
            message=feedback.comment[:200],
            type='document',
            link=STUDENT_EVAL_LINK,
        )


class JuryAssignmentViewSet(viewsets.ModelViewSet):
    """Manage jury assignments to projects."""
    serializer_class = JuryAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'jury':
            return JuryAssignment.objects.filter(jury_member=user)
        elif user.role == 'supervisor':
            return JuryAssignment.objects.filter(project__supervisor=user)
        return JuryAssignment.objects.all()

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admin can assign jury members.")
        assignment = serializer.save()
        # Create evaluation if not exists
        project = assignment.project
        Evaluation.objects.get_or_create(project=project)
        # Notify jury member
        from apps.communications.models import Notification
        Notification.objects.create(
            recipient=assignment.jury_member,
            sender=self.request.user,
            title=f'New jury assignment',
            message=f'You have been assigned to evaluate: {project.title}',
            type='info',
            link='/jury/projects',
        )


class ProjectSubjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
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
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'student' and hasattr(user, 'student_profile'):
            docs = Document.objects.filter(project__student=user.student_profile)
        elif user.role == 'supervisor':
            docs = Document.objects.filter(project__supervisor=user)
        elif user.role == 'jury':
            docs = Document.objects.filter(project__jury_assignments__jury_member=user)
        else:
            docs = Document.objects.all()
        serializer = DocumentSerializer(docs, many=True, context={'request': request})
        return Response(serializer.data)


class AdminDashboardStatsView(APIView):
    """Admin dashboard statistics."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        from apps.students.models import Student
        from apps.supervisors.models import Supervisor
        from apps.juries.models import Jury
        return Response({
            'total_students': Student.objects.count(),
            'total_supervisors': Supervisor.objects.count(),
            'total_jury': Jury.objects.count(),
            'total_projects': Project.objects.count(),
            'projects_in_progress': Project.objects.filter(status='in_progress').count(),
            'projects_completed': Project.objects.filter(status='completed').count(),
            'projects_submitted': Project.objects.filter(status='submitted').count(),
            'total_documents': Document.objects.count(),
            'pending_documents': Document.objects.filter(status='pending').count(),
            'total_evaluations': Evaluation.objects.count(),
            'published_evaluations': Evaluation.objects.filter(is_published=True).count(),
        })
