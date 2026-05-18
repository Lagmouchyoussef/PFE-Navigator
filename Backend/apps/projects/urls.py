from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProjectViewSet, SubjectViewSet, RepositoryView,
    DocumentViewSet, DocumentRemarkViewSet,
    AppointmentViewSet, MilestoneViewSet,
    EvaluationViewSet, FeedbackViewSet,
    JuryAssignmentViewSet, AdminStatsView,
)

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='projects')
router.register('subjects', SubjectViewSet, basename='subjects')
router.register('documents', DocumentViewSet, basename='documents')
router.register('document-remarks', DocumentRemarkViewSet, basename='document-remarks')
router.register('appointments', AppointmentViewSet, basename='appointments')
router.register('milestones', MilestoneViewSet, basename='milestones')
router.register('evaluations', EvaluationViewSet, basename='evaluations')
router.register('feedbacks', FeedbackViewSet, basename='feedbacks')
router.register('jury-assignments', JuryAssignmentViewSet, basename='jury-assignments')

urlpatterns = [
    path('admin-stats/', AdminStatsView.as_view(), name='projects-admin-stats'),
    path('repository/', RepositoryView.as_view(), name='projects-repository'),
    path('', include(router.urls)),
]
