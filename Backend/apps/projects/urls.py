from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProjectViewSet, SubjectViewSet,
    SubjectRequestView, SubjectRequestListView, SubjectRequestActionView,
    RepositoryView,
    DocumentViewSet, DocumentRemarkViewSet,
    AppointmentViewSet, MilestoneViewSet,
    EvaluationViewSet, FeedbackViewSet,
    JuryAssignmentViewSet, AdminStatsView, StudentsView,
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
    path('students/', StudentsView.as_view(), name='projects-students'),
    path('subject-requests/', SubjectRequestView.as_view(), name='subject-request'),
    path('subject-requests/list/', SubjectRequestListView.as_view(), name='subject-request-list'),
    path('subject-requests/<int:pk>/<str:action>/', SubjectRequestActionView.as_view(), name='subject-request-action'),
    path('', include(router.urls)),
]
