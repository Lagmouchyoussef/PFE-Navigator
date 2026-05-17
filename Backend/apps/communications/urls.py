"""URL routing for the communications application."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ContactableUsersView, MessageViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r"messages", MessageViewSet, basename="message")
router.register(r"notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    path("contactable-users/", ContactableUsersView.as_view(), name="contactable-users"),
    path("", include(router.urls)),
]
