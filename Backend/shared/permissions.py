"""Role-based permission classes for PFE Navigator API."""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    message = "Admin access required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "ADMIN")


class IsSupervisor(BasePermission):
    message = "Supervisor access required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "SUPERVISOR")


class IsJury(BasePermission):
    message = "Jury access required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "JURY")


class IsStudent(BasePermission):
    message = "Student access required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "STUDENT")


class IsAdminOrSupervisor(BasePermission):
    message = "Admin or Supervisor access required."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("ADMIN", "SUPERVISOR")
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level: allow if user owns the object or is admin."""

    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True
        owner = getattr(obj, "user", None) or getattr(obj, "uploaded_by", None) or getattr(obj, "sender", None)
        return owner == request.user


class IsOwnerOrReadOnly(BasePermission):
    """Object-level: allow safe methods to anyone authenticated; writes only to owner."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, "user", None) or getattr(obj, "uploaded_by", None)
        return owner == request.user
