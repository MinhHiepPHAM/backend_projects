from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.http import HttpResponse
from django.shortcuts import render, redirect

from authentication.forms import LoginForm, RegisterForm
from authentication.models import CustomUser
from django.contrib.auth.views import LoginView
from django.views.generic.edit import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import View


# def sign_in(request):
#     if request.method == 'POST':
#         form = LoginForm(request.POST)
#         if form.is_valid():
#             password = form.cleaned_data['password']
#             email = form.cleaned_data['email']
#             user = authenticate(request, password=password, email=email)
#             if user:
#                 login(request, user)
#                 messages.success(request, f'Hi {user.first_name} {user.last_name}')
#                 return HttpResponse(f'Hi, you are successful to login in your account. Your email is {email}')
#             else:
#                 return HttpResponse('Email or password is incorrect!')
#         else:
#             messages.error(request, 'Invalid login')
#     else:
#         form = LoginForm()
#     return render(request, "users/login.html", {'form': form})


# def sign_up(request):
#     if request.method == 'POST':
#         form = RegisterForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return HttpResponse(f'Success sign up {form.cleaned_data}')
#         else:
#             return render(request, "users/register.html", {'form': form})

#     else:
#         form = RegisterForm()
#         return render(request, "users/register.html", {'form': form})
    
class CustomLoginView(LoginView):
    form_class = LoginForm
    template_name = 'users/login.html'
    authentication_form = LoginForm

    def form_valid(self, form):
        # Custom logic when the form is valid (e.g., log the user activity)
        username = form.cleaned_data['username']
        self.request.session['username'] = username
        return redirect('dashboard')
    
   # def form_invalid(self, form):
    #    return HttpResponse(f'Unsuccess {form.cleaned_data}')

class DashboardView(LoginRequiredMixin, View):
    login_url = "/dashboard"
    def get(self, request, *args, **kwargs):
        username = self.request.session['username']
        return render(request,"users/dashboard.html",{'username':username})


class RegisterView(FormView):
    template_name = "users/register.html"
    form_class = RegisterForm

    def form_valid(self, form):
        form.save()
        return redirect('login')







    


