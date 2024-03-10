# stock/urls.py

from django.urls import path,re_path
from .views import stock_price, add_stock

urlpatterns = [
    re_path('stock/$', stock_price, name='stock_price'),
    #re_path('stock/$', add_stock, name='add_stock')
]
