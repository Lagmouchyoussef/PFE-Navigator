from django.contrib import admin
from .models import SupervisorProfile


@admin.register(SupervisorProfile)
class SupervisorProfileAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'department']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'department']
    list_filter = ['department']
