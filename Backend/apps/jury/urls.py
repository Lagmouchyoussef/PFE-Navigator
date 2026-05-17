from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import JuryProjectViewSet, JuryDocumentViewSet, JuryEvaluationViewSet

router = DefaultRouter()
router.register('jury/projects', JuryProjectViewSet, basename='jury-projects')
router.register('jury/documents', JuryDocumentViewSet, basename='jury-documents')
router.register('jury/evaluations', JuryEvaluationViewSet, basename='jury-evaluations')

urlpatterns = [
    path('', include(router.urls)),
]
