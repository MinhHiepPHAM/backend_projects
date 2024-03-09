# stock/urls.py

from django.urls import path,re_path
from .views import stock_price

urlpatterns = [
    re_path('home/stock_price/$', stock_price, name='stock_price'),
]
