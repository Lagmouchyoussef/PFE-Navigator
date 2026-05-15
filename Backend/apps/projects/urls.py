from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, DocumentViewSet, DocumentRemarkViewSet,
    AppointmentViewSet, MilestoneViewSet, EvaluationViewSet,
    FeedbackViewSet, JuryAssignmentViewSet,
    ProjectSubjectsView, ProjectRepositoryView, AdminDashboardStatsView
)

app_name = 'projects'

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'document-remarks', DocumentRemarkViewSet, basename='document-remark')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')
router.register(r'feedbacks', FeedbackViewSet, basename='feedback')
router.register(r'jury-assignments', JuryAssignmentViewSet, basename='jury-assignment')

urlpatterns = [
    path('subjects/', ProjectSubjectsView.as_view(), name='project-subjects'),
    path('repository/', ProjectRepositoryView.as_view(), name='project-repository'),
    path('admin-stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
