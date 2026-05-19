from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SubjectViewSet, MessageViewSet, NotificationViewSet

router = DefaultRouter()
router.register('subjects', SubjectViewSet, basename='subjects')
router.register('messages', MessageViewSet, basename='messages')
router.register('notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
]
