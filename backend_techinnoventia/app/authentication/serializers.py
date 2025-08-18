from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from . models import Profil, User


class UserSerializer(serializers.ModelSerializer):
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
        # pour hasher correctement le mot de passe
        user = User.objects.create_user(**validated_data)
        return user


class ProfilSerializer(serializers.ModelSerializer):
    # Le profil est lié à un utilisateur existant, donc on utilise un champ read-only
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profil
        fields = ["id", "user", "image", "phone", "bio", "birth_date", "role"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'username': self.user.username,
            'email': self.user.email,
            'profil': ProfilSerializer(self.user.profil).data
        })
        return data

