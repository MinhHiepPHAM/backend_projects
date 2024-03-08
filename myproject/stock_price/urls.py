# stock/urls.py

from django.urls import path
from .views import stock_price

urlpatterns = [
    path('stock/', stock_price, name='stock_price'),
]
