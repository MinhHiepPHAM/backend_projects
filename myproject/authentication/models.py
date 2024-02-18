from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("email address", unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=30,unique=True)
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['email']  # ['first_name', 'last_name']
    objects = UserManager()

    def __repr__(self) -> str:
        return f'{self.email}, {self.username}, {self.password}'



