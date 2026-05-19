from django.db.models import Count, Avg, Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly
from apps.common.models import Project, Subject, Evaluation, Resource, AdminNote, JuryAssignment, Notification

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

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset

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

    @action(detail=True, methods=['post'], url_path='toggle-jury-docs')
    def toggle_jury_docs(self, request, pk=None):
        project = self.get_object()
        project.jury_documents_open = not project.jury_documents_open
        project.save()

        if project.student:
            state = 'opened' if project.jury_documents_open else 'closed'
            Notification.objects.create(
                recipient=project.student,
                title='Jury submission deadline updated',
                message=f'The administrator has {state} the jury document submission window for your project.',
                type='info',
                link='/student/reports',
            )

        return Response({'jury_documents_open': project.jury_documents_open})

    @action(detail=True, methods=['post'], url_path='assign-jury')
    def assign_jury(self, request, pk=None):
        project = self.get_object()
        jury_member_id = request.data.get('jury_member_id')
        role = request.data.get('role', 'member')
        try:
            jury_member = User.objects.get(id=jury_member_id, role='jury')
        except User.DoesNotExist:
            return Response({'detail': 'Jury member not found.'}, status=404)
        assignment, created = JuryAssignment.objects.get_or_create(
            project=project, jury_member=jury_member,
            defaults={'role': role}
        )
        if not created:
            assignment.role = role
            assignment.save()
        return Response({'detail': 'Jury member assigned.'})


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

    @action(detail=True, methods=['post'], url_path='unpublish')
    def unpublish(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.is_published = False
        evaluation.save()
        return Response(AdminEvaluationSerializer(evaluation).data)

    @action(detail=True, methods=['post'], url_path='update-weights')
    def update_weights(self, request, pk=None):
        evaluation = self.get_object()
        sup_w = request.data.get('supervisor_weight')
        jury_w = request.data.get('jury_weight')
        if sup_w is not None:
            evaluation.supervisor_weight = float(sup_w)
        if jury_w is not None:
            evaluation.jury_weight = float(jury_w)
        evaluation.save()
        return Response(AdminEvaluationSerializer(evaluation).data)


class AdminJuryAssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = JuryAssignment.objects.select_related('project', 'jury_member')
    serializer_class = JuryAssignmentSerializer


class AdminResourceViewSet(viewsets.ModelViewSet):
    """
    Resources hub: readable by all authenticated users, writable only by admin.
    """
    permission_classes = [IsAdminOrReadOnly]
    queryset = Resource.objects.all().order_by('-created_at')
    serializer_class = AdminResourceSerializer

    def perform_create(self, serializer):
        resource = serializer.save(uploaded_by=self.request.user)
        recipients = User.objects.filter(is_active=True).exclude(role='admin')
        Notification.objects.bulk_create([
            Notification(
                recipient=u,
                title='New Resource Available',
                message=f'A new resource "{resource.title}" has been shared in the Resource Center.',
                type='info',
                link=f'/{u.role}/resources',
            )
            for u in recipients
        ])


class AdminNoteViewSet(viewsets.ModelViewSet):
    """
    Administrative notes: readable by all authenticated users (filtered by audience),
    writable only by admin.
    """
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = AdminNoteSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return AdminNote.objects.all()
        audience_map = {
            'student':    ['all', 'students'],
            'supervisor': ['all', 'supervisors'],
            'jury':       ['all', 'juries'],
        }
        allowed = audience_map.get(user.role, ['all'])
        return AdminNote.objects.filter(audience__in=allowed)

    def perform_create(self, serializer):
        note = serializer.save(author=self.request.user)
        audience_role_map = {
            'students':    ['student'],
            'supervisors': ['supervisor'],
            'juries':      ['jury'],
            'all':         ['student', 'supervisor', 'jury'],
        }
        target_roles = audience_role_map.get(note.audience, [])
        if target_roles:
            recipients = User.objects.filter(role__in=target_roles, is_active=True)
            Notification.objects.bulk_create([
                Notification(
                    recipient=u,
                    title=f'New Announcement: {note.title}',
                    message=f'The administrator published a new note: "{note.title}".',
                    type='info',
                    link=f'/{u.role}/notes',
                )
                for u in recipients
            ])

    def perform_update(self, serializer):
        serializer.save()


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
        eval_qs = Evaluation.objects.filter(
            supervisor_score__isnull=False,
            jury_score__isnull=False
        )
        return Response({
            'users': {
                'total':       User.objects.count(),
                'students':    role_counts.get('student', 0),
                'supervisors': role_counts.get('supervisor', 0),
                'juries':      role_counts.get('jury', 0),
                'admins':      role_counts.get('admin', 0),
                'active':      User.objects.filter(is_active=True).count(),
                'inactive':    User.objects.filter(is_active=False).count(),
            },
            'projects': {
                'total': Project.objects.count(),
                **project_counts,
            },
            'subjects': {
                'total':     Subject.objects.count(),
                'available': Subject.objects.filter(status='available').count(),
                'taken':     Subject.objects.filter(status='taken').count(),
                'archived':  Subject.objects.filter(status='archived').count(),
            },
            'evaluations': {
                'total':     Evaluation.objects.count(),
                'graded':    eval_qs.count(),
                'published': Evaluation.objects.filter(is_published=True).count(),
            },
        })


class AdminAnalyticsView(APIView):
    """Detailed analytics for admin dashboard."""
    permission_classes = [IsAdmin]

    def get(self, request):
        from apps.common.models import Appointment, Document

        eval_qs = Evaluation.objects.filter(
            supervisor_score__isnull=False,
            jury_score__isnull=False,
            is_published=True,
        )

        final_grades = []
        pass_count = 0
        for ev in eval_qs:
            sup = float(ev.supervisor_score)
            jury = float(ev.jury_score)
            sw = (ev.supervisor_weight or 50) / 100
            jw = (ev.jury_weight or 50) / 100
            grade = sup * sw + jury * jw
            final_grades.append(grade)
            if grade >= 10:
                pass_count += 1

        avg_grade = (sum(final_grades) / len(final_grades)) if final_grades else 0
        success_rate = (pass_count / len(final_grades) * 100) if final_grades else 0

        distribution = {
            '18-20': sum(1 for g in final_grades if g >= 18),
            '14-17': sum(1 for g in final_grades if 14 <= g < 18),
            '10-13': sum(1 for g in final_grades if 10 <= g < 14),
            '0-9':   sum(1 for g in final_grades if g < 10),
        }

        project_by_status = {
            item['status']: item['count']
            for item in Project.objects.values('status').annotate(count=Count('id'))
        }

        return Response({
            'grades': {
                'average':      round(avg_grade, 2),
                'success_rate': round(success_rate, 1),
                'total_graded': len(final_grades),
                'passed':       pass_count,
                'failed':       len(final_grades) - pass_count,
                'distribution': distribution,
            },
            'projects':   project_by_status,
            'documents': {
                'total':    Document.objects.count(),
                'approved': Document.objects.filter(status='approved').count(),
                'pending':  Document.objects.filter(status='pending').count(),
                'rejected': Document.objects.filter(status='rejected').count(),
            },
            'appointments': {
                'total':     Appointment.objects.count(),
                'confirmed': Appointment.objects.filter(status='Confirmed').count(),
                'pending':   Appointment.objects.filter(status='Pending').count(),
                'cancelled': Appointment.objects.filter(status='Cancelled').count(),
            },
        })
