from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    JuryProjectViewSet, JuryDocumentViewSet,
    JuryEvaluationViewSet, JuryAppointmentViewSet,
    JuryDashboardView,
)

router = DefaultRouter()
router.register('jury/projects',     JuryProjectViewSet,     basename='jury-projects')
router.register('jury/documents',    JuryDocumentViewSet,    basename='jury-documents')
router.register('jury/evaluations',  JuryEvaluationViewSet,  basename='jury-evaluations')
router.register('jury/appointments', JuryAppointmentViewSet, basename='jury-appointments')

urlpatterns = [
    path('jury/dashboard/', JuryDashboardView.as_view(), name='jury-dashboard'),
    path('', include(router.urls)),
]
