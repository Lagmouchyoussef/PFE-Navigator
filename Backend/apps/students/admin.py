from django.contrib import admin
from .models import StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['enrollment_number', 'user', 'specialization', 'academic_year']
    search_fields = ['enrollment_number', 'user__first_name', 'user__last_name']
    list_filter = ['academic_year']
