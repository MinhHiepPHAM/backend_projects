# stock/urls.py

from django.urls import path,re_path
from .views import stock_price, search_csv

urlpatterns = [
    re_path('stock/$', stock_price, name='stock_price'),
    re_path('search_csv/$', search_csv, name='search_csv')
]
