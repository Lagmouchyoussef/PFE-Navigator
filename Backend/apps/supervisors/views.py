"""Views for the supervisors application."""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import SupervisorProfile
from .serializers import SupervisorProfileSerializer, SupervisorProfileUpdateSerializer


class SupervisorProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["department"]
    search_fields = ["user__first_name", "user__last_name", "user__email", "employee_id", "department"]
    ordering_fields = ["user__last_name", "department", "created_at"]
    ordering = ["user__last_name"]

    def get_queryset(self):
        user = self.request.user
        qs = SupervisorProfile.objects.select_related("user").prefetch_related("students")
        if user.role == "ADMIN":
            return qs.all()
        return qs.filter(user=user)

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return SupervisorProfileUpdateSerializer
        return SupervisorProfileSerializer

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Supervisor profiles are created automatically on user creation."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=["get"])
    def students(self, request, pk=None):
        """List students assigned to this supervisor."""
        supervisor = self.get_object()
        from apps.students.serializers import StudentProfileSerializer
        serializer = StudentProfileSerializer(
            supervisor.students.select_related("user"), many=True
        )
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def projects(self, request, pk=None):
        """List projects under this supervisor."""
        supervisor = self.get_object()
        from apps.projects.models import Project
        from apps.projects.serializers import ProjectSerializer
        qs = Project.objects.filter(supervisor=supervisor).select_related("student__user")
        return Response(ProjectSerializer(qs, many=True).data)
