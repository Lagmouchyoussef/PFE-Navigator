from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MessageViewSet, NotificationViewSet,
    AdministrativeNoteViewSet, ResourceViewSet,
    ContactableUsersView
)

app_name = 'communications'

router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'admin-notes', AdministrativeNoteViewSet, basename='admin-note')
router.register(r'resources', ResourceViewSet, basename='resource')

urlpatterns = [
    path('contactable-users/', ContactableUsersView.as_view(), name='contactable-users'),
    path('', include(router.urls)),
]
