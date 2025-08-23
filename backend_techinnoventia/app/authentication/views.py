from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomTokenObtainPairSerializer
from .serializers import UserSerializer, ProfilSerializer
from .serializers import EmailVerificationSerializer, ResendVerificationSerializer
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .permissions import IsAdminOrModeratorOrSuperAdmin, IsSuperAdmin
from .serializers import RoleAssignmentSerializer, UserRoleUpdateSerializer

from . models import User

class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args,**kwargs):
        queryset = User.objects.all()
        return Response({"message": "This is register page a list of users",
        "data": UserSerializer(queryset, many = True).data})

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # deactivate until email verified
            user.is_active = False
            user.save(update_fields=["is_active"])

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            verification_link = f"{request.build_absolute_uri('/')}api/auth/verify-email?uid={uid}&token={token}"
            send_mail(
                subject="Verify your email",
                message=f"Please verify your email by clicking this link: {verification_link}",
                from_email=None,
                recipient_list=[user.email],
                fail_silently=True,
            )
            return Response({
                "message": "User registered successfully",
                "data": UserSerializer(user).data
                }, status = status.HTTP_201_CREATED)
        return Response({
            "message": "Registration failed",
            "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)



class CustomLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class UsersList(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrModeratorOrSuperAdmin]

class ProfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profil = request.user.profil
        serializer = ProfilSerializer(profil)
        return Response(serializer.data)

    def put(self, request):
        profil = request.user.profil
        serializer = ProfilSerializer(profil, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            if not user.is_active:
                user.is_active = True
                user.save(update_fields=["is_active"])
            return Response({"detail": "Email verified"}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        uidb64 = request.query_params.get("uid")
        token = request.query_params.get("token")
        if not uidb64 or not token:
            return Response({"detail": "uid and token are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            if not user.is_active:
                user.is_active = True
                user.save(update_fields=["is_active"])
            return Response({"detail": "Email verified"}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "If the email exists, a verification message has been sent."}, status=status.HTTP_200_OK)

        if user.is_active:
            return Response({"detail": "Email already verified"}, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_link = f"{request.build_absolute_uri('/')}api/auth/verify-email?uid={uid}&token={token}"
        send_mail(
            subject="Verify your email",
            message=f"Please verify your email by clicking this link: {verification_link}",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return Response({"detail": "Verification email sent"}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "If the email exists, a reset link has been sent."}, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{request.build_absolute_uri('/')}api/auth/password-reset/confirm?uid={uid}&token={token}"
        send_mail(
            subject="Password reset",
            message=f"Reset your password using this link: {reset_link}",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return Response({"detail": "Password reset email sent"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"detail": "Password has been reset"}, status=status.HTTP_200_OK)


class RoleManagementView(APIView):
    """
    Role management view for superadmin operations
    """
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        """List all users with their roles"""
        users = User.objects.select_related('profil').all()
        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.profil.role,
                'is_active': user.is_active
            })
        return Response({
            'message': 'Users and their roles',
            'data': user_data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        """Assign role to user"""
        serializer = RoleAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_id = serializer.validated_data['user_id']
        new_role = serializer.validated_data['new_role']
        
        try:
            user = User.objects.get(id=user_id)
            user.profil.role = new_role
            user.profil.save(update_fields=['role'])
            
            return Response({
                'message': f'Role {new_role} assigned to {user.username}',
                'data': {
                    'user_id': user.id,
                    'username': user.username,
                    'new_role': new_role
                }
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'message': 'User not found',
                'error': f'User with id {user_id} does not exist'
            }, status=status.HTTP_404_NOT_FOUND)


class UserRoleUpdateView(APIView):
    """
    Update specific user role
    """
    permission_classes = [IsSuperAdmin]

    def put(self, request, user_id):
        """Update user role"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'message': 'User not found',
                'error': f'User with id {user_id} does not exist'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRoleUpdateSerializer(user.profil, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': f'Role updated for {user.username}',
            'data': {
                'user_id': user.id,
                'username': user.username,
                'new_role': user.profil.role
            }
        }, status=status.HTTP_200_OK)

