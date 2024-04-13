from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
    
class NewsModel(models.Model):
    url = models.URLField(primary_key=True)
    scrapped_date = models.DateField()
    headline = models.CharField(max_length=255)
    context = models.TextField()
    class Meta:
        app_label = 'stock_price'

    def __repr__(self):
        return f'{self.url}'
    
class StockModel(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    company = models.CharField()
    close_price = models.FloatField()
    open_price = models.FloatField()
    low_price = models.FloatField()
    high_price = models.FloatField()
    adj_close_price = models.IntegerField()
    volume = models.BigIntegerField()
    related_news = models.ManyToManyField(NewsModel, related_name='stocks')
    is_trending = models.BooleanField(default=False)
    sector = models.CharField(max_length=250)
    industry = models.CharField(max_length=250)
    country = models.CharField(max_length=250)

    class Meta:
        app_label = 'stock_price'

    def __repr__(self) -> str:
        return self.symbol + ' - ' + self.company
    

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("email address", unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=30,unique=True)
    is_active = models.BooleanField(default=True)
    bio = models.TextField()
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['email'] 
    objects = UserManager()

    def __repr__(self) -> str:
        return f'{self.email}, {self.username}'
    
class Post(models.Model):
    created_time = models.DateTimeField()
    title = models.CharField(max_length=255)
    context = models.TextField()
    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)

    def __repr__(self) -> str:
        return f'{self.title} of {self.user.username}'
    


    
    
