# stock/urls.py

from django.urls import path,re_path
from .views import stock_price, search_symbol,period_selection, ticker_view, search_news

urlpatterns = [
    path('stock/', stock_price, name='stock_price'),
    re_path('search_symbol/$', search_symbol, name='search_symbol'),
    # re_path('period-select/$', period_selection, name='period-select'),
    path('stock/<str:symbol>/', ticker_view, name='ticker_info'),
    re_path('stock_news/$', search_news, name='search_result'),
]
