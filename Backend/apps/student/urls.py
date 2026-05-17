from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    StudentProjectView, StudentSubjectListView,
    StudentDocumentViewSet, StudentMilestoneViewSet,
    StudentAppointmentViewSet, StudentFeedbackView,
)

router = DefaultRouter()
router.register('student/documents', StudentDocumentViewSet, basename='student-documents')
router.register('student/milestones', StudentMilestoneViewSet, basename='student-milestones')
router.register('student/appointments', StudentAppointmentViewSet, basename='student-appointments')

urlpatterns = [
    path('student/project/', StudentProjectView.as_view(), name='student-project'),
    path('student/subjects/', StudentSubjectListView.as_view(), name='student-subjects'),
    path('student/feedback/', StudentFeedbackView.as_view(), name='student-feedback'),
    path('', include(router.urls)),
]
