import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.students.models import Student

User = get_user_model()

def seed():
    print("Starting seed...")
    
    try:
        # 1. Clean up existing test users
        User.objects.filter(email="student@emsi.ma").delete()
        User.objects.filter(email="admin@emsi.ma").delete()
        Student.objects.filter(enrollment_number="20260001").delete()
        print("Cleaned up existing test users.")

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
        print(f"Student user {email} created")

        # 3. Create Admin User
        admin_email = "admin@emsi.ma"
        admin_username = "admin_user"
        admin_password = "admin123"

        admin_user = User.objects.create(
            email=admin_email,
            username=admin_username,
            first_name="Admin",
            last_name="User",
            role="admin",
            institutional_id="ADM-2026-001"
        )
        admin_user.set_password(admin_password)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        print(f"Admin user {admin_email} created")

        # 4. Create Student Profile
        try:
            student = Student.objects.create(
                user=user,
                enrollment_number="20260001",
                specialization="Software Engineering",
                academic_year="5th Year"
            )
            print(f"Student profile created")
        except Exception as e:
            print(f"Student profile creation warning: {e}")
        
        print("\nSEEDING COMPLETED!")
        print("=" * 50)
        print("Test credentials:")
        print("  Student: student@emsi.ma / password123")
        print("  Admin: admin@emsi.ma / admin123")
        print("=" * 50)
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed()
