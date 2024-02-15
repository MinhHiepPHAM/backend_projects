from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("email address", unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=30)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name','username']
    objects = UserManager
