from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist() 
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        if CustomUser.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = CustomUser.objects.create_user(
                username = username,
                password = password,
                email = email,
            )
            user.save()

            return Response({'username':username}, status=status.HTTP_201_CREATED)

class HomeView(APIView):
    def get(self, request):
        print(request.data)
        return Response(request.data)
    