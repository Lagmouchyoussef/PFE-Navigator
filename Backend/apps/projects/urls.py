from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, DocumentViewSet, AppointmentViewSet, 
    MilestoneViewSet, EvaluationViewSet
)

app_name = 'projects'

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('', include(router.urls)),
]
