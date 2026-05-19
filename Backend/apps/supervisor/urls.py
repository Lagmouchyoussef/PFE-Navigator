from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SupervisorStudentViewSet, SupervisorProjectViewSet,
    SupervisorDocumentViewSet, SupervisorMilestoneViewSet,
    SupervisorAppointmentViewSet, SupervisorFeedbackViewSet,
    SupervisorEvaluationViewSet, SupervisorSubjectViewSet,
    SupervisorDashboardView,
)

router = DefaultRouter()
router.register('supervisor/students',     SupervisorStudentViewSet,     basename='supervisor-students')
router.register('supervisor/projects',     SupervisorProjectViewSet,     basename='supervisor-projects')
router.register('supervisor/documents',    SupervisorDocumentViewSet,    basename='supervisor-documents')
router.register('supervisor/milestones',   SupervisorMilestoneViewSet,   basename='supervisor-milestones')
router.register('supervisor/appointments', SupervisorAppointmentViewSet, basename='supervisor-appointments')
router.register('supervisor/feedback',     SupervisorFeedbackViewSet,    basename='supervisor-feedback')
router.register('supervisor/evaluations',  SupervisorEvaluationViewSet,  basename='supervisor-evaluations')
router.register('supervisor/subjects',     SupervisorSubjectViewSet,     basename='supervisor-subjects')

urlpatterns = [
    path('supervisor/dashboard/', SupervisorDashboardView.as_view(), name='supervisor-dashboard'),
    path('', include(router.urls)),
]
