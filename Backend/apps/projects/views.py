"""Views for the projects application."""

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from shared.permissions import IsAdmin, IsAdminOrSupervisor
from .models import Document, Evaluation, Project, Schedule
from .serializers import (
    DocumentSerializer,
    EvaluationSerializer,
    ProjectCreateSerializer,
    ProjectSerializer,
    ScheduleSerializer,
)

User = get_user_model()
channel_layer = get_channel_layer()


def _push_ws(user_id: int, payload: dict):
    """Fire-and-forget WebSocket push to a user's group."""
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {"type": "project.updated", "payload": payload},
        )


def _notify(user, title: str, message: str, ntype: str = "INFO"):
    from apps.communications.models import Notification
    Notification.objects.create(user=user, title=title, message=message, type=ntype)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "supervisor"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "status", "title"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.select_related(
            "student__user", "supervisor__user"
        )
        if user.role == "ADMIN":
            return qs.all()
        if user.role == "SUPERVISOR":
            return qs.filter(supervisor__user=user)
        if user.role == "JURY":
            return qs.filter(schedules__jury_members__user=user).distinct()
        # STUDENT
        if hasattr(user, "student_profile"):
            return qs.filter(student=user.student_profile)
        return qs.none()

    def get_serializer_class(self):
        if self.action == "create":
            return ProjectCreateSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "STUDENT" and hasattr(user, "student_profile"):
            project = serializer.save(student=user.student_profile)
        else:
            project = serializer.save()
        _notify(
            project.supervisor.user,
            f"New project submitted: {project.title}",
            f"Student {project.student.user.get_full_name()} submitted a new project.",
            "INFO",
        )

    def perform_update(self, serializer):
        project = serializer.save()
        _push_ws(project.student.user.id, {
            "event": "project_updated",
            "project_id": project.id,
            "status": project.status,
        })

    # ── Custom actions ────────────────────────────────────────────────────────

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        project = self.get_object()
        user = request.user
        if user.role == "STUDENT" and (
            not hasattr(user, "student_profile") or project.student != user.student_profile
        ):
            return Response({"detail": "You can only submit your own project."}, status=403)
        if project.status != Project.STATUS_DRAFT:
            return Response({"detail": "Only DRAFT projects can be submitted."}, status=400)
        project.status = Project.STATUS_SUBMITTED
        project.save()
        _push_ws(project.student.user.id, {"event": "status_changed", "status": project.status})
        return Response(ProjectSerializer(project).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        project = self.get_object()
        project.status = Project.STATUS_APPROVED
        project.save()
        _notify(project.student.user, "Project Approved", f'Your project "{project.title}" has been approved.', "SUCCESS")
        _push_ws(project.student.user.id, {"event": "status_changed", "status": project.status})
        return Response(ProjectSerializer(project).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        project = self.get_object()
        project.status = Project.STATUS_REJECTED
        project.save()
        _notify(project.student.user, "Project Rejected", f'Your project "{project.title}" was rejected.', "ERROR")
        _push_ws(project.student.user.id, {"event": "status_changed", "status": project.status})
        return Response(ProjectSerializer(project).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminOrSupervisor])
    def start(self, request, pk=None):
        project = self.get_object()
        if project.status != Project.STATUS_APPROVED:
            return Response({"detail": "Project must be APPROVED to start."}, status=400)
        project.status = Project.STATUS_IN_PROGRESS
        project.save()
        _push_ws(project.student.user.id, {"event": "status_changed", "status": project.status})
        return Response(ProjectSerializer(project).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminOrSupervisor])
    def complete(self, request, pk=None):
        project = self.get_object()
        project.status = Project.STATUS_COMPLETED
        project.save()
        _notify(project.student.user, "Project Completed", f'Your project "{project.title}" has been marked as completed.', "SUCCESS")
        _push_ws(project.student.user.id, {"event": "status_changed", "status": project.status})
        return Response(ProjectSerializer(project).data)

    @action(detail=False, methods=["get"], permission_classes=[IsAdmin])
    def stats(self, request):
        qs = Project.objects.all()
        by_status = dict(
            qs.values("status").annotate(count=Count("id")).values_list("status", "count")
        )
        from apps.students.models import StudentProfile
        from apps.supervisors.models import SupervisorProfile
        from apps.juries.models import JuryProfile
        return Response({
            "total_users": User.objects.count(),
            "total_students": StudentProfile.objects.count(),
            "total_supervisors": SupervisorProfile.objects.count(),
            "total_jury": JuryProfile.objects.count(),
            "total_projects": qs.count(),
            "projects_by_status": by_status,
            "total_evaluations": Evaluation.objects.count(),
            "total_documents": Document.objects.count(),
        })


class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["project"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = Evaluation.objects.select_related("project__student__user", "evaluator")
        if user.role == "ADMIN":
            return qs.all()
        if user.role == "SUPERVISOR":
            return qs.filter(project__supervisor__user=user)
        if user.role == "JURY":
            return qs.filter(evaluator=user)
        if user.role == "STUDENT" and hasattr(user, "student_profile"):
            return qs.filter(project__student=user.student_profile)
        return qs.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ("ADMIN", "SUPERVISOR", "JURY"):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only supervisors, jury, or admin can evaluate.")
        evaluation = serializer.save(evaluator=user)
        _notify(
            evaluation.project.student.user,
            "New Evaluation Submitted",
            f"A new evaluation has been submitted for your project.",
            "SUCCESS",
        )
        async_to_sync(channel_layer.group_send)(
            f"user_{evaluation.project.student.user.id}",
            {"type": "push.notification", "payload": {
                "event": "new_evaluation",
                "project_id": evaluation.project.id,
                "grade": str(evaluation.grade),
            }},
        ) if channel_layer else None


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["project"]
    search_fields = ["title"]

    def get_queryset(self):
        user = self.request.user
        qs = Document.objects.select_related("project__student__user", "uploaded_by")
        if user.role == "ADMIN":
            return qs.all()
        if user.role == "SUPERVISOR":
            return qs.filter(project__supervisor__user=user)
        if user.role == "JURY":
            return qs.filter(project__schedules__jury_members__user=user).distinct()
        if user.role == "STUDENT" and hasattr(user, "student_profile"):
            return qs.filter(project__student=user.student_profile)
        return qs.none()

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["status", "project"]
    ordering = ["date"]

    def get_queryset(self):
        user = self.request.user
        qs = Schedule.objects.select_related("project__student__user").prefetch_related("jury_members__user")
        if user.role == "ADMIN":
            return qs.all()
        if user.role == "SUPERVISOR":
            return qs.filter(project__supervisor__user=user)
        if user.role == "JURY":
            return qs.filter(jury_members__user=user)
        if user.role == "STUDENT" and hasattr(user, "student_profile"):
            return qs.filter(project__student=user.student_profile)
        return qs.none()

    def perform_create(self, serializer):
        if self.request.user.role not in ("ADMIN",):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admin can create defense schedules.")
        schedule = serializer.save()
        _notify(
            schedule.project.student.user,
            "Defense Scheduled",
            f"Your defense has been scheduled on {schedule.date.strftime('%Y-%m-%d %H:%M')} at {schedule.location}.",
            "INFO",
        )
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"user_{schedule.project.student.user.id}",
                {"type": "push.notification", "payload": {
                    "event": "schedule_updated",
                    "schedule_id": schedule.id,
                }},
            )
