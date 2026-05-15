#!/usr/bin/env python
"""Test script to verify all API endpoints."""

import requests
import json
import sys

BASE_URL = "http://localhost:8001/api"

def test_endpoints():
    print("=" * 60)
    print("API ENDPOINT TESTING")
    print("=" * 60)
    
    # 1. Login
    print("\n1. Testing LOGIN endpoint...")
    login_data = {
        "email": "student@emsi.ma",
        "password": "password123",
        "role": "student"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            token = data.get('access')
            print(f"   ✅ Login successful")
            print(f"   Token: {token[:20]}...")
        else:
            print(f"   ❌ Login failed: {response.text}")
            sys.exit(1)
    except Exception as e:
        print(f"   ❌ Connection error: {e}")
        sys.exit(1)
    
    # Headers with token
    headers = {"Authorization": f"Token {token}"}
    
    # 2. Test /api/students/
    print("\n2. Testing GET /api/students/...")
    try:
        response = requests.get(f"{BASE_URL}/students/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Students endpoint working")
            print(f"   Response type: {type(data).__name__}")
            if isinstance(data, list):
                print(f"   Count: {len(data)} students")
        else:
            print(f"   ⚠️  Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 3. Test /api/projects/subjects/
    print("\n3. Testing GET /api/projects/subjects/...")
    try:
        response = requests.get(f"{BASE_URL}/projects/subjects/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Subjects endpoint working")
            print(f"   Response type: {type(data).__name__}")
            if isinstance(data, list):
                print(f"   Count: {len(data)} subjects")
                if data:
                    print(f"   First subject: {data[0]}")
        else:
            print(f"   ⚠️  Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 4. Test /api/projects/repository/
    print("\n4. Testing GET /api/projects/repository/...")
    try:
        response = requests.get(f"{BASE_URL}/projects/repository/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Repository endpoint working")
            print(f"   Response type: {type(data).__name__}")
            if isinstance(data, list):
                print(f"   Count: {len(data)} documents")
        else:
            print(f"   ⚠️  Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 5. Test /api/users/ (admin list)
    print("\n5. Testing GET /api/users/ (as student - should be denied)...")
    try:
        response = requests.get(f"{BASE_URL}/users/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 403:
            print(f"   ✅ Correctly denied for non-admin")
        elif response.status_code == 200:
            data = response.json()
            print(f"   ⚠️  Endpoint working but should be admin-only")
            print(f"   Count: {len(data)} users" if isinstance(data, list) else f"   Response: {data}")
        else:
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("✅ All endpoint tests completed!")
    print("=" * 60)

if __name__ == "__main__":
    test_endpoints()
