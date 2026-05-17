import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def seed_database():
    print("[*] Starting Database Seeding...")
    
    users_to_create = [
        {
            'email': 'admin@emsi.ma',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'password': 'admin123',
            'institutional_id': 'ADM-2026-001',
            'is_staff': True,
            'is_superuser': True
        },
        {
            'email': 'student@emsi.ma',
            'first_name': 'Ahmed',
            'last_name': 'Khalil',
            'role': 'student',
            'password': 'password123',
            'institutional_id': 'STU-2026-001',
            'is_staff': False,
            'is_superuser': False
        },
        {
            'email': 'supervisor@emsi.ma',
            'first_name': 'Prof. Ahmed',
            'last_name': 'Supervisor',
            'role': 'supervisor',
            'password': 'password123',
            'institutional_id': 'SUP-2026-001',
            'is_staff': False,
            'is_superuser': False
        },
        {
            'email': 'jury@emsi.ma',
            'first_name': 'Prof. Maria',
            'last_name': 'Jury',
            'role': 'jury',
            'password': 'password123',
            'institutional_id': 'JUR-2026-001',
            'is_staff': False,
            'is_superuser': False
        }
    ]
    
    for user_info in users_to_create:
        email = user_info['email']
        # Clean up existing user if any
        User.objects.filter(email=email).delete()
        
        # Create user
        user = User.objects.create(
            email=email,
            first_name=user_info['first_name'],
            last_name=user_info['last_name'],
            role=user_info['role'],
            institutional_id=user_info['institutional_id'],
            is_staff=user_info['is_staff'],
            is_superuser=user_info['is_superuser']
        )
        user.set_password(user_info['password'])
        user.save()
        print(f"[+] Created {user_info['role']} account: {email} / {user_info['password']}")

    print("\n[+] DATABASE SEEDING COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    seed_database()
