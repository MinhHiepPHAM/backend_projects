from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.utils.translation import gettext as _
import datetime

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

class Budget(models.Model):
    title = models.CharField(max_length=255)
    start = models.DateField(_("Date"),default=datetime.date.today)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='budgets')
    last_updated = models.DateField(_("Date"))
    start_base = models.DateField(_("Date")) # updated when reset the balance

    def get_budget_amount(self):
        return sum(participant.payed for participant in self.participants.all())
    
    def get_participant_names(self):
        return [participant.username for participant in self.participants.all()]
        

class Participant(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField()
    payed = models.IntegerField(default=0)
    in_budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='participants')

class Category(models.Model):
    name = models.CharField(max_length=255)
    in_budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='categories')

class Session(models.Model):
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    in_budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='sessions')

class AmountPerUserPerSession(models.Model):
    amount = models.IntegerField()
    username = models.CharField(max_length=50)
    session = models.ForeignKey(Session, related_name='amounts', on_delete=models.CASCADE)

