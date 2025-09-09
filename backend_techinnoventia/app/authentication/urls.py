from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserRegisterView, CustomLoginView, UsersList, ProfilView,
    VerifyEmailView, ResendVerificationEmailView, PasswordResetRequestView,
    PasswordResetConfirmView, RoleManagementView,
)

router = DefaultRouter()
router.register(r'users', UsersList, basename='users')

urlpatterns = [
    # Auth
    path("register/", UserRegisterView.as_view(), name="register"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("profile/", ProfilView.as_view(), name="profile"),

    # Email verification
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),
    path("resend-verification/", ResendVerificationEmailView.as_view(), name="resend_verification"),

    # Password reset
    path("password-reset/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    # Role management (admin only)
    path("roles/", RoleManagementView.as_view(), name="role_management"),

    # Users list (admin only)
    path("", include(router.urls)),
]
