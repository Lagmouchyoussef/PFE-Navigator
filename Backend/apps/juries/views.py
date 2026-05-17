"""Views for the juries application."""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import JuryProfile
from .serializers import JuryProfileSerializer, JuryProfileUpdateSerializer


class JuryProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["institution"]
    search_fields = ["user__first_name", "user__last_name", "user__email", "employee_id"]
    ordering_fields = ["user__last_name", "institution", "created_at"]
    ordering = ["user__last_name"]

    def get_queryset(self):
        user = self.request.user
        qs = JuryProfile.objects.select_related("user")
        if user.role in ("ADMIN", "SUPERVISOR"):
            return qs.all()
        return qs.filter(user=user)

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return JuryProfileUpdateSerializer
        return JuryProfileSerializer

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Jury profiles are created automatically on user creation."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=["get"])
    def schedules(self, request, pk=None):
        """Defense schedules assigned to this jury member."""
        jury = self.get_object()
        from apps.projects.models import Schedule
        from apps.projects.serializers import ScheduleSerializer
        qs = Schedule.objects.filter(jury_members=jury).select_related("project__student__user")
        return Response(ScheduleSerializer(qs, many=True).data)
