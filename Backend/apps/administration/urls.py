from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AdminUserViewSet, AdminSubjectViewSet, AdminProjectViewSet,
    AdminEvaluationViewSet, AdminJuryAssignmentViewSet,
    AdminResourceViewSet, AdminNoteViewSet, AdminStatsView,
)

router = DefaultRouter()
router.register('admin/users', AdminUserViewSet, basename='admin-users')
router.register('admin/subjects', AdminSubjectViewSet, basename='admin-subjects')
router.register('admin/projects', AdminProjectViewSet, basename='admin-projects')
router.register('admin/evaluations', AdminEvaluationViewSet, basename='admin-evaluations')
router.register('admin/jury-assignments', AdminJuryAssignmentViewSet, basename='admin-jury-assignments')
router.register('admin/resources', AdminResourceViewSet, basename='admin-resources')
router.register('admin/notes', AdminNoteViewSet, basename='admin-notes')

urlpatterns = [
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
