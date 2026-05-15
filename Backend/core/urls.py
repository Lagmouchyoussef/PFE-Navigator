"""
URL configuration for Scientific Research Portal backend.

Main URL routing configuration that includes all application URLs.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('apps.users.urls', namespace='auth')),
    path('api/users/', include('apps.users.urls', namespace='users')),
    path('api/students/', include('apps.students.urls', namespace='students')),
    path('api/supervisors/', include('apps.supervisors.urls', namespace='supervisors')),
    path('api/juries/', include('apps.juries.urls', namespace='juries')),
    path('api/projects/', include('apps.projects.urls', namespace='projects')),
]
