from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomTokenObtainPairSerializer
from .serializers import UserSerializer, ProfilSerializer

from . models import User

class UserRegisterView(APIView):

    def get(self, request, *args,**kwargs):
        queryset = User.objects.all()
        serializer = UserSerializer
        return Response({"message": "This is register page a list of users",
        "data": UserSerializer(queryset, many = True).data})

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "data": UserSerializer(user).data
                }, status = status.HTTP_201_CREATED)
        return Response({
            "message": "Registration failed",
            "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)



class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UsersList(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProfilView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        profil = request.user.profil
        serializer = ProfilSerializer
        return Response(serializer.data)

    def put(self, request):
        profil = request.user.profil
        serializer = ProfilSerializer(profil, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

