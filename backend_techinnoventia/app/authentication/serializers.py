from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profil, User


# --- USER SERIALIZERS ---

class UserSerializer(serializers.ModelSerializer):
    """
    Base serializer for User model.
    Used for general user info.
    """
    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "avatar",
            "email", "slug", "password", "last_login", "is_active"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "last_login": {"read_only": True},
            "is_active": {"read_only": True},
            "avatar": {"read_only": True},
            "slug": {"read_only": True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer used for user profile, update, and listing.
    Factorized to avoid duplicates.
    """
    class Meta:
        model = User
        fields = [
            "username", "email", "first_name", "last_name",
            "avatar", "slug", "last_login", "is_active"
        ]
        read_only_fields = ["slug", "last_login", "is_active"]

    def update(self, instance, validated_data):
        """
        Update user instance with validated data.
        """
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance


# --- PROFIL SERIALIZER ---

class ProfilSerializer(serializers.ModelSerializer):
    """
    Serializer for Profil model.
    """
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profil
        fields = ["id", "user", "image", "phone", "bio", "birth_date", "role"]


# --- AUTH SERIALIZERS ---

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extend token response with user and profil data.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            "username": self.user.username,
            "email": self.user.email,
            "profil": ProfilSerializer(self.user.profil).data
        })
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_active = False  # deactivate until email verified
        user.save(update_fields=["is_active"])
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    """
    Serializer for user login.
    """
    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return attrs


class UserLogoutSerializer(serializers.Serializer):
    """
    Serializer for logging out users.
    """
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs.get("refresh")
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except Exception:
            raise serializers.ValidationError("Invalid token")
        return {"detail": "Successfully logged out"}


# --- EMAIL & PASSWORD RESET SERIALIZERS ---

class EmailVerificationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)


# --- ROLE SERIALIZERS ---

class RoleAssignmentSerializer(serializers.Serializer):
    """
    Serializer for role assignment (superadmin only).
    """
    user_id = serializers.IntegerField()
    new_role = serializers.ChoiceField(choices=[
        ("user", "Default User"),
        ("eleve", "Eleve"),
        ("admin", "Admin"),
        ("moderator", "Moderator"),
        ("superadmin", "Superadmin")
    ])


class UserRoleUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user role (superadmin only).
    """
    class Meta:
        model = Profil
        fields = ["role"]
        read_only_fields = ["user"]
