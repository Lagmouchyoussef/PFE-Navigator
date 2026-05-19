from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer as AuthUserSerializer
from apps.common.models import (
    Subject, Project, Document, DocumentRemark,
    Milestone, Appointment, Evaluation, Feedback, JuryAssignment,
    Notification,
)
from .serializers import (
    SubjectSerializer, ProjectListSerializer, ProjectCreateSerializer,
    ProjectDashboardSerializer,
    DocumentSerializer, DocumentCreateSerializer, DocumentRemarkSerializer,
    AppointmentSerializer, MilestoneSerializer, EvaluationSerializer,
    FeedbackSerializer, JuryAssignmentSerializer,
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

        from django.utils import timezone
        today = timezone.localdate()

        # Auto-open jury document submission on defense day
        if not project.jury_documents_open:
            if Appointment.objects.filter(project=project, type='defense', date=today).exists():
                project.jury_documents_open = True
                project.save(update_fields=['jury_documents_open'])

        # Send a one-time "defense is today" notification
        defense_today = Appointment.objects.filter(
            project=project,
            type='defense',
            date=today,
            reminder_sent=False,
        ).first()
        if defense_today:
            Notification.objects.create(
                recipient=request.user,
                title='Your Defense is Today!',
                message=(
                    f'Your thesis defense "{defense_today.title}" is scheduled for today'
                    f' at {defense_today.time}'
                    f'{" — " + defense_today.location if defense_today.location else ""}.'
                    f' Good luck!'
                ),
                type='defense',
                link='/student/schedule',
            )
            defense_today.reminder_sent = True
            defense_today.save(update_fields=['reminder_sent'])

        return Response(ProjectDashboardSerializer(project, context={'request': request}).data)

    @action(detail=True, methods=['post'], url_path='toggle_jury_deadline')
    def toggle_jury_deadline(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
        project = self.get_object()
        project.jury_documents_open = not project.jury_documents_open
        project.save(update_fields=['jury_documents_open'])
        if project.jury_documents_open and project.student:
            Notification.objects.create(
                recipient=project.student,
                title='Jury Document Submission Open',
                message=(
                    'The jury document deadline for your project has been opened by the administrator. '
                    'You can now submit documents for the jury from the My Documents page.'
                ),
                type='info',
                link='/student/reports',
            )
        return Response({'id': project.id, 'jury_documents_open': project.jury_documents_open})

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
        user = self.request.user
        project_ids = get_user_projects(user).values_list('id', flat=True)
        qs = Document.objects.filter(project_id__in=project_ids).select_related('student', 'project')
        if user.role == 'supervisor':
            qs = qs.filter(target='supervisor')
        elif user.role == 'jury':
            qs = qs.filter(target='jury', project__jury_documents_open=True)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = DocumentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_serializer = DocumentSerializer(serializer.instance, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            try:
                project = Project.objects.get(student=user)
            except Project.DoesNotExist:
                raise ValidationError({'detail': 'No project found for this student.'})

            target = serializer.validated_data.get('target', 'supervisor')
            if target == 'jury' and not project.jury_documents_open:
                from django.utils import timezone
                if Appointment.objects.filter(project=project, type='defense', date=timezone.localdate()).exists():
                    project.jury_documents_open = True
                    project.save(update_fields=['jury_documents_open'])
                else:
                    raise ValidationError({'detail': 'Jury document submission is not open yet. Wait for the administrator to open the deadline.'})

            doc = serializer.save(student=user, project=project)

            if project.supervisor:
                Notification.objects.create(
                    recipient=project.supervisor,
                    title='New document uploaded',
                    message=f'{user.name} uploaded "{doc.title}" (for {doc.get_target_display()}).',
                    type='info',
                    link='/supervisor/documents',
                )

            for admin in User.objects.filter(role='admin', is_active=True):
                Notification.objects.create(
                    recipient=admin,
                    title='New document uploaded',
                    message=f'{user.name} uploaded "{doc.title}" targeting {doc.get_target_display()}.',
                    type='info',
                    link='/admin/documents',
                )

            if target == 'jury':
                for ja in JuryAssignment.objects.filter(project=project).select_related('jury_member'):
                    Notification.objects.create(
                        recipient=ja.jury_member,
                        title='New Jury Document Submitted',
                        message=(
                            f'{user.name} submitted a document for your review: '
                            f'"{doc.title}". Open Jury Documents to review it.'
                        ),
                        type='info',
                        link='/jury/documents',
                    )
        else:
            serializer.save()

    def destroy(self, request, *args, **kwargs):
        doc = self.get_object()
        if doc.target == 'jury' and doc.status != 'pending':
            return Response(
                {'detail': 'This document has already been reviewed by the jury and cannot be deleted.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        doc = self.get_object()
        doc.status = 'approved'
        doc.save()
        if doc.student:
            Notification.objects.create(
                recipient=doc.student,
                title='Document Approved',
                message=f'Your document "{doc.title}" has been approved by {request.user.name}.',
                type='approved',
                link='/student/reports',
            )
        return Response(DocumentSerializer(doc, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        doc = self.get_object()
        doc.status = 'rejected'
        doc.comment = request.data.get('reason', '')
        doc.save()
        if doc.student:
            Notification.objects.create(
                recipient=doc.student,
                title='Document Rejected',
                message=f'Your document "{doc.title}" was rejected. Reason: {doc.comment or "No reason provided."}',
                type='rejected',
                link='/student/reports',
            )
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
                appt = serializer.save(
                    student=user,
                    project=project,
                    supervisor=project.supervisor,
                )
                if project.supervisor:
                    Notification.objects.create(
                        recipient=project.supervisor,
                        title='New Meeting Request',
                        message=f'{user.name} requested a meeting: "{appt.title}" on {appt.date}.',
                        type='info',
                        link='/supervisor/schedule',
                    )
                for admin in User.objects.filter(role='admin', is_active=True):
                    Notification.objects.create(
                        recipient=admin,
                        title='New Meeting Request',
                        message=f'{user.name} requested a meeting with {project.supervisor.name if project.supervisor else "their supervisor"}: "{appt.title}" on {appt.date}.',
                        type='info',
                        link='/admin/dashboard',
                    )
            except Project.DoesNotExist:
                raise ValidationError({'detail': 'No project found for this student.'})
        else:
            appt = serializer.save()
            if appt.type and appt.type.lower() == 'defense' and appt.project_id:
                try:
                    project = Project.objects.select_related('student', 'supervisor').get(pk=appt.project_id)
                    location_str = f' — {appt.location}' if appt.location else ''
                    student_name = project.student.name if project.student else 'a student'

                    # Notify student
                    if project.student:
                        Notification.objects.create(
                            recipient=project.student,
                            title='Defense Date Scheduled',
                            message=(
                                f'Your thesis defense has been scheduled: "{appt.title}" '
                                f'on {appt.date} at {appt.time}{location_str}. '
                                f'Check your schedule for details.'
                            ),
                            type='defense',
                            link='/student/schedule',
                        )

                    # Notify supervisor
                    if project.supervisor:
                        Notification.objects.create(
                            recipient=project.supervisor,
                            title='Defense Scheduled',
                            message=(
                                f'Defense scheduled for your student {student_name}: '
                                f'"{appt.title}" on {appt.date} at {appt.time}{location_str}.'
                            ),
                            type='defense',
                            link='/supervisor/schedule',
                        )

                    # Notify assigned jury members
                    for ja in JuryAssignment.objects.filter(project=project).select_related('jury_member'):
                        Notification.objects.create(
                            recipient=ja.jury_member,
                            title='Defense Assigned to You',
                            message=(
                                f'You are assigned as {ja.role} for the defense of {student_name}: '
                                f'"{appt.title}" on {appt.date} at {appt.time}{location_str}.'
                            ),
                            type='defense',
                            link='/jury/schedule',
                        )

                    # Notify all admins
                    for admin in User.objects.filter(role='admin', is_active=True):
                        Notification.objects.create(
                            recipient=admin,
                            title='Defense Scheduled',
                            message=(
                                f'Defense scheduled: "{appt.title}" for {student_name} '
                                f'on {appt.date} at {appt.time}{location_str}.'
                            ),
                            type='defense',
                            link='/admin/jury-planning',
                        )
                except Project.DoesNotExist:
                    pass

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Cancelled'
        appointment.save()
        if appointment.student and appointment.student != request.user:
            Notification.objects.create(
                recipient=appointment.student,
                title='Appointment Cancelled',
                message=f'Your appointment "{appointment.title}" on {appointment.date} was cancelled by {request.user.name}.',
                type='rejected',
                link='/student/schedule',
            )
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Confirmed'
        appointment.save()
        if appointment.student:
            Notification.objects.create(
                recipient=appointment.student,
                title='Appointment Confirmed',
                message=f'Your appointment "{appointment.title}" on {appointment.date} has been confirmed by {request.user.name}.',
                type='approved',
                link='/student/schedule',
            )
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
        return Evaluation.objects.filter(project_id__in=project_ids).select_related(
            'project__student', 'project__supervisor'
        )

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

        project = evaluation.project
        student = project.student
        supervisor = project.supervisor
        student_name = student.name if student else 'the student'

        # Compute final grade for notification messages
        sup = float(evaluation.supervisor_score) if evaluation.supervisor_score is not None else None
        jury = float(evaluation.jury_score) if evaluation.jury_score is not None else None
        sup_w = (evaluation.supervisor_weight or 50) / 100
        jury_w = (evaluation.jury_weight or 50) / 100
        if sup is not None and jury is not None:
            final = sup * sup_w + jury * jury_w
        elif sup is not None:
            final = sup
        elif jury is not None:
            final = jury
        else:
            final = None
        final_str = f'{final:.2f}/20' if final is not None else 'N/A'
        passed = final is not None and final >= 10
        result_str = 'PASSED ✓' if passed else ('FAILED ✗' if final is not None else 'pending')

        # Notify student
        if student:
            Notification.objects.create(
                recipient=student,
                title='Your Grades Have Been Published',
                message=(
                    f'Your PFE evaluation grades have been published by the administrator. '
                    f'Final grade: {final_str} — {result_str}. '
                    f'(Supervisor: {f"{sup:.2f}/20" if sup is not None else "N/A"}, '
                    f'Jury: {f"{jury:.2f}/20" if jury is not None else "N/A"}). '
                    f'Open the Evaluation page to view the details.'
                ),
                type='grade',
                link='/student/evaluation',
            )

        # Notify supervisor
        if supervisor:
            Notification.objects.create(
                recipient=supervisor,
                title='Grades Published for Your Student',
                message=(
                    f'The evaluation grades for {student_name} have been published. '
                    f'Final grade: {final_str} — {result_str}.'
                ),
                type='grade',
                link='/supervisor/evaluation',
            )

        # Notify all assigned jury members
        for ja in JuryAssignment.objects.filter(project=project).select_related('jury_member'):
            Notification.objects.create(
                recipient=ja.jury_member,
                title='Grades Published',
                message=(
                    f'The evaluation grades for {student_name} have been published by the administrator. '
                    f'Final grade: {final_str} — {result_str}.'
                ),
                type='grade',
                link='/jury/evaluation',
            )

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
        user = self.request.user
        feedback = serializer.save(author=user)
        if feedback.project.student:
            Notification.objects.create(
                recipient=feedback.project.student,
                title='New Feedback Received',
                message=f'{user.name} left feedback on your project: "{feedback.title}".',
                type='info',
                link='/student/dashboard',
            )


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

    def perform_create(self, serializer):
        assignment = serializer.save()
        if assignment.project.student:
            Notification.objects.create(
                recipient=assignment.project.student,
                title='Jury Member Assigned',
                message=f'{assignment.jury_member.name} has been assigned as a jury member ({assignment.role}) for your project defense.',
                type='defense',
                link='/student/schedule',
            )


class StudentsView(APIView):
    """Role-aware students list: supervisors see their students; admins see all."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'supervisor':
            student_ids = Project.objects.filter(supervisor=user).values_list('student_id', flat=True)
            students = User.objects.filter(id__in=student_ids, role='student')
        elif user.role in ('admin', 'jury'):
            students = User.objects.filter(role='student', is_active=True)
        else:
            return Response([])

        return Response(AuthUserSerializer(students, many=True).data)


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
