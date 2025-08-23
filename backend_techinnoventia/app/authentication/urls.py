from django.urls import path, include


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'user-list', views.UsersList, basename='user-list')

app_name = "app.authentication"

urlpatterns = [
    path("token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),

    path("login", views.CustomLoginView.as_view(), name="custom_login"),
    path("register", views.UserRegisterView.as_view(), name="custom_signin"),
    path("profil", views.ProfilView.as_view(), name="user_profil"),
    path("verify-email", views.VerifyEmailView.as_view(), name="verify_email"),
    path("verify-email/resend", views.ResendVerificationEmailView.as_view(), name="resend_verify_email"),
    path("password-reset", views.PasswordResetRequestView.as_view(), name="password_reset"),
    path("password-reset/confirm", views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("roles", views.RoleManagementView.as_view(), name="role_management"),
    path("roles/<int:user_id>", views.UserRoleUpdateView.as_view(), name="user_role_update"),

    path("", include(router.urls)),
]




