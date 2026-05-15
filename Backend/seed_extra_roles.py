import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

User = get_user_model()

def seed_all_roles():
    roles = [
        ('supervisor', 'supervisor@emsi.ma', 'supervisor_user', 'Prof. Ahmed', 'Supervisor'),
        ('jury', 'jury@emsi.ma', 'jury_user', 'Prof. Maria', 'Jury'),
    ]
    
    password = "password123"
    
    for role, email, username, first, last in roles:
        User.objects.filter(email=email).delete()
        user = User.objects.create(
            email=email,
            username=username,
            first_name=first,
            last_name=last,
            role=role,
            institutional_id=f"{role.upper()}-2026-001"
        )
        user.set_password(password)
        user.save()
        print(f"Created {role} user: {email} / {password}")

if __name__ == "__main__":
    seed_all_roles()
