from django.contrib import admin
from .models import (
    Subject, Project, Document, DocumentRemark, Milestone,
    Appointment, Evaluation, Feedback, JuryAssignment,
    Message, Notification, AdminNote, Resource,
)

admin.site.register(Subject)
admin.site.register(Project)
admin.site.register(Document)
admin.site.register(DocumentRemark)
admin.site.register(Milestone)
admin.site.register(Appointment)
admin.site.register(Evaluation)
admin.site.register(Feedback)
admin.site.register(JuryAssignment)
admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(AdminNote)
admin.site.register(Resource)
