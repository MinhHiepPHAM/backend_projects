from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class CustomModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()

        # Check if the username is a valid email address
        is_email = '@' in username

        # Authenticate the user using either username or email
        # .filter(email=username): This is a filtering condition applied to the QuerySet.
        # It retrieves all instances of the model where the email field matches the provided username
        # The .first() method is used to get the first matching user or None if no user is found.
        user = UserModel.objects.filter(email=username).first() if is_email else UserModel.objects.filter(username=username).first()

        if user and user.check_password(password):
            return user

        # If authentication fails, return None
        return None

