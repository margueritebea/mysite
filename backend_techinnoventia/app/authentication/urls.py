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

    path("", include(router.urls)),
]




