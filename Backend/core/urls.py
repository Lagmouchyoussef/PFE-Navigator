"""
URL configuration for Scientific Research Portal backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth & Users
    path('api/auth/', include('apps.users.urls', namespace='auth')),
    path('api/users/', include('apps.users.urls', namespace='users')),

    # Role profiles
    path('api/students/', include('apps.students.urls', namespace='students')),
    path('api/supervisors/', include('apps.supervisors.urls', namespace='supervisors')),
    path('api/juries/', include('apps.juries.urls', namespace='juries')),

    # Projects (documents, evaluations, milestones, appointments, jury assignments)
    path('api/projects/', include('apps.projects.urls', namespace='projects')),

    # Communications (messages, notifications, admin notes, resources)
    path('api/communications/', include('apps.communications.urls', namespace='communications')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
