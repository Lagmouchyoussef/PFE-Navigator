from django.contrib import admin
from .models import JuryProfile


@admin.register(JuryProfile)
class JuryProfileAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'institution']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'institution']
    list_filter = ['institution']
