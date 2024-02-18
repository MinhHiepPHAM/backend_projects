from django.contrib import admin
from authentication.models import CustomUser
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(admin.ModelAdmin):
   list_display = ['email', 'username', 'first_name', 'last_name', 'password']
    
admin.site.register(CustomUser, CustomUserAdmin)  # Register the custom UserAdmin
