from django.contrib import admin
from .models import Project, Evaluation, Document, Schedule


class DocumentInline(admin.TabularInline):
    model = Document
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'student', 'supervisor', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'student__user__last_name', 'student__user__first_name']
    inlines = [DocumentInline]
    date_hierarchy = 'created_at'


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ['project', 'evaluator', 'grade', 'created_at']
    list_filter = ['created_at']
    search_fields = ['project__title']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'uploaded_by', 'created_at']
    search_fields = ['title', 'project__title']


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['project', 'date', 'location', 'status']
    list_filter = ['status', 'date']
    search_fields = ['project__title', 'location']
