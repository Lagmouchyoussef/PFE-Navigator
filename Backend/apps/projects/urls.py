"""URL routing for the projects application."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DocumentViewSet, EvaluationViewSet, ProjectViewSet, ScheduleViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"evaluations", EvaluationViewSet, basename="evaluation")
router.register(r"documents", DocumentViewSet, basename="document")
router.register(r"schedules", ScheduleViewSet, basename="schedule")

urlpatterns = [path("", include(router.urls))]
