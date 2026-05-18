from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SubjectViewSet, MessageViewSet, NotificationViewSet,
    AdminNoteViewSet, ResourceViewSet,
)

router = DefaultRouter()
router.register('subjects', SubjectViewSet, basename='subjects')
router.register('messages', MessageViewSet, basename='messages')
router.register('notifications', NotificationViewSet, basename='notifications')
router.register('admin/notes', AdminNoteViewSet, basename='admin-notes')
router.register('admin/resources', ResourceViewSet, basename='admin-resources')

urlpatterns = [
    path('', include(router.urls)),
]
