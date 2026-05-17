"""URL routing for the supervisors application."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SupervisorProfileViewSet

router = DefaultRouter()
router.register(r"", SupervisorProfileViewSet, basename="supervisor-profile")

urlpatterns = [path("", include(router.urls))]
