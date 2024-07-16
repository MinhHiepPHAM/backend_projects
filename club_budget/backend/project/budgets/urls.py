from django.urls import path
from rest_framework import routers
from . import views

urlpatterns = [
    # path('login/', views.LoginView.as_view(), name='login'),
    path('signup/', views.RegistrationView.as_view(), name='register'),
]