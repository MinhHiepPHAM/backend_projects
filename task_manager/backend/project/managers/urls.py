from django.urls import path,re_path
from rest_framework import routers
from . import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('signup/', views.RegistrationView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('users/<int:pk>/editprofile/', views.ProfileEditingView.as_view(), name='profile_editing'),
    path('users/<int:pk>/', views.UserProfileView.as_view({'get':'retrieve'}), name='user_profile'),
    path('users/<int:pk>/activities/', views.UserActivityView.as_view({'get':'retrieve'}), name='user_activities'),
    path('users/<int:pk>/activities/create/', views.CreateActivityView.as_view(), name='create_activities'),
    
]
 