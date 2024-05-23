from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.utils.translation import gettext_lazy as _
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("email address", unique=True)
    username = models.CharField(max_length=30,unique=True)

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    
    is_active = models.BooleanField(default=True)
    telephone = models.CharField(max_length=20)
    street = models.CharField(max_length=250)
    street_number = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    bio = models.TextField()
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['email'] 
    objects = UserManager()

    def __repr__(self) -> str:
        return f'{self.email}, {self.username}'
    
class GroupUser(models.Model):
    name = models.CharField(max_length=250)
    members = models.ManyToManyField(CustomUser, related_name='member_of_groups')
    admins = models.ManyToManyField(CustomUser, related_name='admin_of_groups')
    
class Activity(models.Model):
    class ActType(models.TextChoices):
        RUNNING = 'RUN', _('Running')
        SWIMMING = 'SWIM', _('Swimming')
        BICYCLE = 'BIKE', _('Bicycle')
    
    type = models.CharField(max_length=4, choices=ActType.choices)
    title = models.CharField(max_length=250)
    users = models.ManyToManyField(CustomUser, related_name='activities')
    createdby = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    distance = models.IntegerField(default=0)
    created_time = models.DateTimeField()
    
class Award(models.Model):
    class Medal(models.TextChoices):
        GOLD = 'GOLD', _('Gole Medal')
        SILVER = 'SILVER', _('Silver Medal')
        COPPER = 'COPPER', _('Copper Medal')
        PARITCIPANT = 'PARTI', _('Participant Certificat')
    title = models.CharField(max_length=250)
    medal = models.CharField(max_length=6, choices=Medal.choices, default=Medal.PARITCIPANT)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    user = models.ManyToManyField(CustomUser, related_name='awards')
    


