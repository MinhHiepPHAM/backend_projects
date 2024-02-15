from django import forms
from django.contrib.auth.forms import UserCreationForm
from authentication.models import CustomUser


class LoginForm(forms.Form):
    email = forms.EmailField(max_length=100)
    password = forms.CharField(max_length=100, widget=forms.PasswordInput)


class RegisterForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'last_name', 'first_name','password1','password2']
