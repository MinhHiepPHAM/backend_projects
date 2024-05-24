from django.urls import path,re_path
from rest_framework import routers
from . import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('signup/', views.RegistrationView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('users/editprofile/<int:pk>', views.ProfileEditingView.as_view(), name='profile_editing'),
]
