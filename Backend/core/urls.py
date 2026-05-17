"""URL configuration for PFE Navigator backend."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth endpoints (login, logout, refresh, me)
    path("api/auth/", include("apps.users.urls")),

    # Resource endpoints
    path("api/students/", include("apps.students.urls")),
    path("api/supervisors/", include("apps.supervisors.urls")),
    path("api/juries/", include("apps.juries.urls")),
    path("api/projects/", include("apps.projects.urls")),
    path("api/communications/", include("apps.communications.urls")),

    # OpenAPI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
