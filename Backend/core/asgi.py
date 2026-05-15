"""
ASGI config for Scientific Research Portal backend.

Exposes the ASGI callable as a module-level variable named ``application``.
Reference: https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_asgi_application()
