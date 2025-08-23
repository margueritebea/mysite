from rest_framework.permissions import BasePermission
from .models import Profil
from functools import wraps
from django.http import JsonResponse
from rest_framework import status


class IsAdminOrModeratorOrSuperAdmin(BasePermission):
    """
    Allow access only to users with role in {admin, moderator, superadmin}.
    """

    allowed_roles = {"admin", "moderator", "superadmin"}

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        try:
            return user.profil.role in self.allowed_roles
        except Profil.DoesNotExist:
            return False


class IsSuperAdmin(BasePermission):
    """
    Allow access only to users with superadmin role.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        try:
            return user.profil.role == "superadmin"
        except Profil.DoesNotExist:
            return False


class IsModeratorOrHigher(BasePermission):
    """
    Allow access only to users with role in {moderator, admin, superadmin}.
    """

    allowed_roles = {"moderator", "admin", "superadmin"}

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        try:
            return user.profil.role in self.allowed_roles
        except Profil.DoesNotExist:
            return False


def require_role(allowed_roles):
    """
    Decorator for function-based views to check user role.
    Usage: @require_role(['admin', 'superadmin'])
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return JsonResponse(
                    {"detail": "Authentication required"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            try:
                if request.user.profil.role not in allowed_roles:
                    return JsonResponse(
                        {"detail": "Insufficient permissions"}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except Profil.DoesNotExist:
                return JsonResponse(
                    {"detail": "User profile not found"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_superadmin(view_func):
    """
    Decorator for function-based views to require superadmin role.
    Usage: @require_superadmin
    """
    return require_role(['superadmin'])(view_func)


def require_admin_or_higher(view_func):
    """
    Decorator for function-based views to require admin or higher role.
    Usage: @require_admin_or_higher
    """
    return require_role(['admin', 'superadmin'])(view_func)


def require_moderator_or_higher(view_func):
    """
    Decorator for function-based views to require moderator or higher role.
    Usage: @require_moderator_or_higher
    """
    return require_role(['moderator', 'admin', 'superadmin'])(view_func)


