from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import status
from .models import CustomUser

class RegistrationView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password1 = request.data.get("password1")
        password2 = request.data.get("password2")
        if password1 != password2:
             return Response({'error': 'Passwords are not identical'}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = CustomUser.objects.create_user(
                username = username,
                password = password1,
                email = email,
            )
            user.save()

            return Response({'username':username}, status=status.HTTP_201_CREATED)   

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        username, password = request.data['username'], request.data['password']
        user = authenticate(username=username, password=password)
        if user:
            token,_ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid user or password'}, status=401)
        
class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        try:
            # print('logout view', request.data)
            # request.user = CustomUser.objects.get(username=request.data['username'])
            # print('user:', request.user)
            token = Token.objects.get(pk=request.data['token'])
            token.delete()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)


