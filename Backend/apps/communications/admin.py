from django.contrib import admin
from .models import Message, Notification, AdministrativeNote, Resource

admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(AdministrativeNote)
admin.site.register(Resource)
