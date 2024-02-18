from typing import Any
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from authentication.models import CustomUser
from django.contrib.auth import authenticate


class LoginForm(AuthenticationForm): pass
    #  def clean(self):
    #     username = self.cleaned_data.get("username")
    #     password = self.cleaned_data.get("password")

    #     if username is not None and password:
    #         if '@' in username:
    #             kwargs = {'email': username}
    #         else:
    #             kwargs = {'username': username}
    #         print(kwargs)
    #         self.user_cache = authenticate(
    #             self.request, **kwargs, password=password
    #         )
    #         if self.user_cache is None:
    #             raise self.get_invalid_login_error()
    #         else:
    #             self.confirm_login_allowed(self.user_cache)

    #     return self.cleaned_data


class RegisterForm(UserCreationForm):
    #email = forms.EmailField(required=True)
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password1', 'password2']
