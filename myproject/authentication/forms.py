from typing import Any
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from authentication.models import CustomUser
from django.contrib.auth import authenticate


class LoginForm(AuthenticationForm): pass


class RegisterForm(UserCreationForm):
    #email = forms.EmailField(required=True)
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password1', 'password2']
