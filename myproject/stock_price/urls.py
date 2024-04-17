# stock/urls.py

from django.urls import path,re_path

from . import auth_views#trending_stock_view, search_symbol,period_selection, ticker_view, search_news

urlpatterns = [
    # path('stock/trendings', trending_stock_view, name='trending_stock'),
    # re_path('search_symbol/$', search_symbol, name='search_symbol'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('signup/', auth_views.RegisterUserView.as_view(), name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('home/', auth_views.HomeView.as_view(), name='home'),
    # path('stock/<str:symbol>/', ticker_view, name='ticker_info'),
    # re_path('stock_news/$', search_news, name='search_result'),
]
