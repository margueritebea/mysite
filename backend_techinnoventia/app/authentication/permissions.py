from rest_framework.permissions import BasePermission
from .models import Profil
from functools import wraps
from django.http import JsonResponse
from rest_framework import status


class IsAdmin(BasePermission):
    """
    Allow access only to users with role = admin.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        try:
            return user.profil.role == "admin"
        except Profil.DoesNotExist:
            return False


# --- FUNCTION-BASED VIEWS DECORATOR ---

def require_admin(view_func):
    """
    Decorator for function-based views to check admin role.
    Usage:
        @require_admin
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            if request.user.profil.role != "admin":
                return JsonResponse(
                    {"detail": "Admin role required"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profil.DoesNotExist:
            return JsonResponse(
                {"detail": "User profile not found"},
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return wrapper
