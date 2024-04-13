# stock/urls.py

from django.urls import path,re_path
from .views import trending_stock_view, search_symbol,period_selection, ticker_view, search_news

urlpatterns = [
    path('stock/trendings', trending_stock_view, name='trending_stock'),
    re_path('search_symbol/$', search_symbol, name='search_symbol'),
    # re_path('period-select/$', period_selection, name='period-select'),
    path('stock/<str:symbol>/', ticker_view, name='ticker_info'),
    re_path('stock_news/$', search_news, name='search_result'),
]
