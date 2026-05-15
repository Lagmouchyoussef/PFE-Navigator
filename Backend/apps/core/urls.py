"""URL routing for the core application."""

from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health-check'),
]
