#from django.contrib import messages
#from django.contrib.auth import authenticate, login
#from django.http import HttpResponse
from typing import Any
#from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, redirect

from authentication.forms import LoginForm, RegisterForm
#from authentication.models import CustomUser
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic.edit import FormView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import View
from django.urls import reverse
from django.contrib.auth.views import PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
    
class CustomLoginView(LoginView):
    # form_class = LoginForm
    template_name = 'users/login.html'
    authentication_form = LoginForm



class DashboardView(LoginRequiredMixin, View):
    redirect_field_name = 'dashboard'

    def get(self, request, *args, **kwargs):
        username = self.request.user
        return render(self.request,'users/dashboard.html',{'username':username})
    

class RegisterView(FormView):
    template_name = "users/register.html"
    form_class = RegisterForm

    def form_valid(self, form):
        form.save()
        return redirect('login')
    
    
class CustomLogoutView(LogoutView):
    pass

class HomePageView(View):
    template_name = 'home.html'

    def get(self, request, *args, **kwargs):
        user = request.user
        context = {"user":user}
        return render(request,self.template_name,context)
    

class CustomPasswordResetView(PasswordResetView):
    template_name = 'password_reset/password_reset.html'

class CustomPasswordResetDoneView(PasswordResetDoneView):
    template_name = 'password_reset/password_reset_done.html'

class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'password_reset/password_reset_confirm.html'

class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    template_name = 'password_reset/password_reset_complete.html'

    
