"""URL routing for the students application."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StudentProfileViewSet

router = DefaultRouter()
router.register(r"", StudentProfileViewSet, basename="student-profile")

urlpatterns = [path("", include(router.urls))]
