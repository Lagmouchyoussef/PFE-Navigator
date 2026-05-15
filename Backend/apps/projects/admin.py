"""Admin configuration for the projects application."""

from django.contrib import admin
from .models import Project, ProjectMilestone, Document, Appointment, Evaluation, Feedback


class MilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 1


class DocumentInline(admin.TabularInline):
    model = Document
    extra = 1


class AppointmentInline(admin.TabularInline):
    model = Appointment
    extra = 1


class FeedbackInline(admin.StackedInline):
    model = Feedback
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'student', 'supervisor', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'student__user__last_name', 'student__user__first_name']
    inlines = [MilestoneInline, DocumentInline, AppointmentInline, FeedbackInline]
    date_hierarchy = 'created_at'


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ['project', 'supervisor_score', 'jury_score', 'is_published']
    list_filter = ['is_published']
    search_fields = ['project__title']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'target', 'status', 'version']
    list_filter = ['target', 'status']
    search_fields = ['title', 'project__title']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'date', 'time', 'type', 'status']
    list_filter = ['type', 'status', 'date']
    search_fields = ['title', 'project__title']


admin.site.register(ProjectMilestone)
admin.site.register(Feedback)
