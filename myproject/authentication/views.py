from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

from authentication.forms import LoginForm


def sign_in(request):
    if request.method == 'GET':
        form = LoginForm()
        return render(request, 'users/login.html', {'form': form})
    elif request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            user = authenticate(request,password=password,email=email)
            if user:
                login(request, user)
                messages.success(request, f'Hi {user.first_name} {user.last_name}')
                return redirect('home')

        messages.error(request,'Invalid username or password')
        return render(request, "users/login.html", {'form':form})




