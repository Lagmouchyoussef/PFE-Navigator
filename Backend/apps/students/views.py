"""Views for the students application."""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from shared.permissions import IsAdmin
from .models import StudentProfile
from .serializers import StudentProfileSerializer, StudentProfileUpdateSerializer


class StudentProfileViewSet(viewsets.ModelViewSet):
    """CRUD for student profiles — admin/supervisor read-all, student reads own."""

    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["specialization", "academic_year", "supervisor"]
    search_fields = ["user__first_name", "user__last_name", "user__email", "enrollment_number"]
    ordering_fields = ["user__last_name", "academic_year", "created_at"]
    ordering = ["user__last_name"]

    def get_queryset(self):
        user = self.request.user
        qs = StudentProfile.objects.select_related("user", "supervisor__user")
        if user.role == "ADMIN":
            return qs.all()
        if user.role == "SUPERVISOR":
            return qs.filter(supervisor__user=user)
        # Student sees only their own profile
        return qs.filter(user=user)

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return StudentProfileUpdateSerializer
        return StudentProfileSerializer

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Student profiles are created automatically on user creation."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAdmin])
    def stats(self, request):
        from django.db.models import Count
        data = (
            StudentProfile.objects
            .values("academic_year")
            .annotate(count=Count("id"))
            .order_by("academic_year")
        )
        return Response(list(data))
