import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.students.models import Student
from apps.projects.models import Project
from django.db import transaction

User = get_user_model()

def seed():
    print("Starting seed with transaction.atomic...")
    try:
        with transaction.atomic():
            # 1. Clean up
            User.objects.filter(email="student@emsi.ma").delete()
            print("Cleaned up existing test user.")

            # 2. Create Student User
            email = "student@emsi.ma"
            username = "student_user"
            password = "password123"
            
            user = User.objects.create(
                email=email,
                username=username,
                first_name="Ahmed",
                last_name="Khalil",
                role="student",
                institutional_id="STU-2026-001"
            )
            user.set_password(password)
            user.save()
            print(f"User {email} created with ID {user.id}")
            
            # 3. Create Student Profile
            student = Student.objects.create(
                user=user,
                enrollment_number="20260001",
                specialization="Software Engineering",
                academic_year="5th Year"
            )
            print(f"Student profile created.")

            # 4. Create a Project for the student
            Project.objects.create(
                student=student,
                title="Smart City Navigation System",
                description="An AI-powered navigation system for smart cities.",
                status="draft",
                start_date="2025-10-01",
                end_date="2026-06-30"
            )
            print(f"Initial project created.")
    except Exception as e:
        print(f"Error during seeding: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed()
