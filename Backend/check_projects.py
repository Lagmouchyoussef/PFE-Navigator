import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.projects.models import Project

total = Project.objects.count()
submitted = Project.objects.filter(status='submitted').count()
print(f"Total: {total}")
print(f"Submitted: {submitted}")

for p in Project.objects.filter(status='submitted'):
    print(f"ID: {p.id}, Title: {p.title}, Supervisor: {p.supervisor}")
