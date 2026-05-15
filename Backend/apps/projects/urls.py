from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, DocumentViewSet, AppointmentViewSet, 
    MilestoneViewSet, EvaluationViewSet, ProjectSubjectsView, ProjectRepositoryView
)

app_name = 'projects'

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('subjects/', ProjectSubjectsView.as_view(), name='project-subjects'),
    path('repository/', ProjectRepositoryView.as_view(), name='project-repository'),
    path('', include(router.urls)),
]
