from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SupervisorStudentViewSet, SupervisorProjectViewSet,
    SupervisorDocumentViewSet, SupervisorMilestoneViewSet,
    SupervisorAppointmentViewSet, SupervisorFeedbackViewSet,
)

router = DefaultRouter()
router.register('supervisor/students', SupervisorStudentViewSet, basename='supervisor-students')
router.register('supervisor/projects', SupervisorProjectViewSet, basename='supervisor-projects')
router.register('supervisor/documents', SupervisorDocumentViewSet, basename='supervisor-documents')
router.register('supervisor/milestones', SupervisorMilestoneViewSet, basename='supervisor-milestones')
router.register('supervisor/appointments', SupervisorAppointmentViewSet, basename='supervisor-appointments')
router.register('supervisor/feedback', SupervisorFeedbackViewSet, basename='supervisor-feedback')

urlpatterns = [
    path('', include(router.urls)),
]
