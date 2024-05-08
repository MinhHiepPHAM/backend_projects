# stock/urls.py

from django.urls import path,re_path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers

from . import auth_views, views

router = routers.SimpleRouter()
router.register(r'home', views.HomeView, 'home_view')
router.register(r'news', views.NewsView, 'news_view')
router.register(r'trendings', views.TrendingView, 'trending_stock')

urlpatterns = [
    # re_path('search_symbol/$', search_symbol, name='search_symbol'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', auth_views.RegisterUserView.as_view(), name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('tickers/<str:symbol>/<str:period>', views.TickerView.as_view({'get':'retrieve'}), name='ticker_detail'),
    # path('stock/<str:symbol>/', ticker_view, name='ticker_info'),
    # re_path('stock_news/$', search_news, name='search_result'),
] + router.urls
