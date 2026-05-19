from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    StudentProjectView, StudentSubjectListView,
    StudentDocumentViewSet, StudentMilestoneViewSet,
    StudentAppointmentViewSet, StudentFeedbackView,
    StudentEvaluationView,
    StudentByIdView, StudentDocumentsByIdView, StudentEvaluationByIdView,
)

router = DefaultRouter()
router.register('student/documents',    StudentDocumentViewSet,    basename='student-documents')
router.register('student/milestones',   StudentMilestoneViewSet,   basename='student-milestones')
router.register('student/appointments', StudentAppointmentViewSet, basename='student-appointments')

urlpatterns = [
    # ── Student-facing endpoints ──────────────────────────────────────────────
    path('student/project/',    StudentProjectView.as_view(),    name='student-project'),
    path('student/subjects/',   StudentSubjectListView.as_view(), name='student-subjects'),
    path('student/feedback/',   StudentFeedbackView.as_view(),   name='student-feedback'),
    path('student/evaluation/', StudentEvaluationView.as_view(), name='student-evaluation'),

    # ── Supervisor / Admin access to individual student data ──────────────────
    path('students/<int:pk>/',             StudentByIdView.as_view(),            name='student-detail'),
    path('students/<int:pk>/documents/',   StudentDocumentsByIdView.as_view(),   name='student-documents-by-id'),
    path('students/<int:pk>/evaluation/',  StudentEvaluationByIdView.as_view(),  name='student-evaluation-by-id'),

    path('', include(router.urls)),
]
