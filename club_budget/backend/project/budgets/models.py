from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("email address", unique=True)
    username = models.CharField(max_length=50,unique=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __repr__(self) -> str:
        return f'{self.email}, {self.username}'



