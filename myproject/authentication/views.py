from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse
from django.shortcuts import render, redirect

from authentication.forms import LoginForm, RegisterForm
from authentication.models import CustomUser


def sign_in(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            user = authenticate(request, password=password, email=email)
            if user:
                login(request, user)
                messages.success(request, f'Hi {user.first_name} {user.last_name}')
                return redirect('home')
            else:
                return HttpResponse('Email or password is incorrect!')
        else:
            messages.error(request, 'Invalid login')
    else:
        form = LoginForm()
    return render(request, "users/login.html", {'form': form})


def sign_up(request):
    print(f'method: {request.method}')
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse(f'Success sign up {form.cleaned_data}')
        else:
            return render(request, "users/register.html", {'form': form})

    else:
        form = RegisterForm()
        return render(request, "users/register.html", {'form': form})

