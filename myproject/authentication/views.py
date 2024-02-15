from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.shortcuts import render, redirect

from authentication.forms import LoginForm, RegisterForm


def sign_in(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            user = authenticate(request,password=password,email=email)
            print(user)
            if user:
                login(request, user)
                messages.success(request, f'Hi {user.first_name} {user.last_name}')
                return redirect('home')
            else:
                messages.error(request, 'Email or password is incorrect!')
        else:
            messages.error(request, 'Invalid login')
    else:
        form = LoginForm()
    return render(request, "users/login.html", {'form':form})

def sign_up(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        # if form.is_valid():
        #     user = Custom

