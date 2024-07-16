from rest_framework import generics, permissions
from rest_framework import status
from . import serializers, models
import re
from rest_framework.response import Response

class RegistrationView(generics.CreateAPIView):
    serializer_class = serializers.RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def _is_valid_email(self, email):
        regex = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
        return re.match(regex, email)
    
    def post(self, request):
        username = request.data.get("username")
        if models.CustomUser.objects.filter(username=username):
            return Response({'error': 'Username is already used'}, status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get("email")
        if not self._is_valid_email(email):
            return Response({'error': 'Email is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        password1 = request.data.get("password1")
        password2 = request.data.get("password2")
        if password1 != password2:
             return Response({'error': 'Passwords are not identical'}, status=status.HTTP_400_BAD_REQUEST)
        if models.CustomUser.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = models.CustomUser.objects.create_user(
            username = username,
            password = password1,
            email = email,
        )
        user.save()

        return Response({'username':username}, status=status.HTTP_201_CREATED)   
