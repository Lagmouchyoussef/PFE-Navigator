"""
Custom permissions for the Scientific Research Portal API.

Defines role-based and resource-level permission classes.
"""

from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to admin users."""
    
    message = 'Admin access required.'
    
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'admin'


class IsStudent(BasePermission):
    """Allow access only to student users."""
    
    message = 'Student access required.'
    
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'student'


class IsSupervisor(BasePermission):
    """Allow access only to supervisor users."""
    
    message = 'Supervisor access required.'
    
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'supervisor'


class IsJury(BasePermission):
    """Allow access only to jury users."""
    
    message = 'Jury access required.'
    
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'jury'


class IsOwner(BasePermission):
    """Allow access only to the owner of an object."""
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
