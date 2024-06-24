from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer, ProfileEditingSerializer, ActivitySerializer, ActionSerializer
from rest_framework import status
from .models import *
import re
from datetime import datetime, timedelta
from .pagination import UserPagination
import collections


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def _is_valid_email(self, email):
        regex = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
        return re.match(regex, email)
    
    def post(self, request):
        username = request.data.get("username")
        if CustomUser.objects.filter(username=username):
            return Response({'error': 'Username is already used'}, status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get("email")
        if not self._is_valid_email(email):
            return Response({'error': 'Email is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        password1 = request.data.get("password1")
        password2 = request.data.get("password2")
        if password1 != password2:
             return Response({'error': 'Passwords are not identical'}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(
            username = username,
            password = password1,
            email = email,
        )
        user.save()

        return Response({'username':username}, status=status.HTTP_201_CREATED)   

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        username, password = request.data['username'], request.data['password']
        user = authenticate(username=username, password=password)
        if user:
            token,_ = Token.objects.get_or_create(user=user)
            uid = CustomUser.objects.get(username=username).pk
            return Response({'token': token.key, 'uid':uid})
        else:
            return Response({'error': 'Invalid user or password'}, status=401)
        
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            token = Token.objects.get(pk=request.data['token'])
            token.delete()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

class BelongToUser(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        has_perm = super().has_permission(request, view)
        user = request.user.username
        other = CustomUser.objects.get(pk=view.kwargs['pk']).username
        return has_perm and (user == other)
    
class IsInActivity(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        has_perm = super().has_permission(request, view)
        username = request.user.username
        users = Activity.objects.get(pk=view.kwargs['pk']).users.all()
        canSee = any(username == user.username for user in users)

        return has_perm and canSee

class ProfileEditingView(generics.UpdateAPIView, generics.RetrieveAPIView):
    serializer_class = ProfileEditingSerializer
    permission_classes = [BelongToUser,]
    queryset = CustomUser.objects.all()

class UserProfileView(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CreateActivityView(generics.CreateAPIView, generics.RetrieveAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            type = {'Running':'RUN', 'Swimming':'SWIM', 'Bicycle':'BIKE'}[data.get('type')]
            
            title = data.get('title')
            if not title:
                return Response({'error': 'Title can not be empty'}, status=status.HTTP_404_NOT_FOUND)
        
            usernames = data.get('users')
            for username in usernames:
                if not CustomUser.objects.filter(username=username).exists():
                    return Response({'error': f'user: {username} does not exist'}, status=status.HTTP_404_NOT_FOUND)

            user_objs = [CustomUser.objects.get(username=name) for name in usernames]
            user = data.get('createdby')
            if user not in usernames:
                user_objs.append(CustomUser.objects.get(username=user))
            createdby = CustomUser.objects.get(username=user)
            start = data.get('start')
            if not start:
                return Response({'error': 'Need to set the start date of the activity'}, status=status.HTTP_404_NOT_FOUND)
            start = datetime.strptime(start, "%a, %d %b %Y %H:%M:%S %Z")
            terminate = data.get('terminate')
            terminate = datetime.strptime(terminate, "%a, %d %b %Y %H:%M:%S %Z")
            description = data.get('description')

            activity = Activity.objects.create(
                type = type,
                title = title,
                createdby = createdby,
                distance = 0,
                created_time = datetime.now(),
                start = start,
                terminate = terminate,
                description = description,
                updated = datetime.now()
            )
            for user in user_objs:
                activity.users.add(user)

            activity.save()
            return Response({'activity': title, 'createdby': data.get('createdby'), 'type': type}, status=status.HTTP_201_CREATED) 
        except Exception as e:
            return Response({'Create failed': str(e)}, status=status.HTTP_404_NOT_FOUND)
    
class UserActivitySummaryView(ModelViewSet):
    permission_classes = [BelongToUser]
    serializer_class = ActivitySerializer
    # queryset = Activity.objects.all()

    def retrieve(self, request, *args, **kwargs):
        response = {}
        search_query = self.request.query_params.get('uq','')
        users = CustomUser.objects.all().order_by('username').filter(username__icontains=search_query)[:10]
        usernames = [user.username for user in users]
        # usernames = [obj.username for obj in CustomUser.objects.all().order_by('username')]
        response['usernames'] = usernames
        running_acts = CustomUser.objects.get(pk=kwargs['pk']).activities.filter(type='RUN').order_by('-updated', 'start')[:2]
        swimming_acts = CustomUser.objects.get(pk=kwargs['pk']).activities.filter(type='SWIM').order_by('-updated', 'start')[:2]
        bicycle_acts = CustomUser.objects.get(pk=kwargs['pk']).activities.filter(type='BIKE').order_by('-updated', 'start')[:2]

        response['running'] = self.serializer_class(running_acts,many=True).data
        response['swimming'] = self.serializer_class(swimming_acts,many=True).data
        response['bicycle'] = self.serializer_class(bicycle_acts,many=True).data
        
        # print(response)
        return Response(response, status=status.HTTP_200_OK)
    
class UserActivityAllView(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActivitySerializer
    # queryset = Activity.objects.all()
    def retrieve(self, request, *args, **kwargs):
        response = {}
        search_query = self.request.query_params.get('uq','')
        users = CustomUser.objects.all().order_by('username').filter(username__icontains=search_query)[:10]
        usernames = [user.username for user in users]
        activities = CustomUser.objects.get(pk=kwargs['pk']).activities.order_by('-updated', 'start')
        activities = self.serializer_class(activities, many=True).data
        response = {'activities':activities, 'usernames': usernames}
        return Response(response,status=status.HTTP_200_OK)

class ActivityView(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    def retrieve(self, request, *args, **kwargs):
        activity = Activity.objects.get(pk=kwargs['pk'])
        actions = activity.actions

        search_query = self.request.query_params.get('uq','')
        users = CustomUser.objects.all().order_by('username').filter(username__icontains=search_query)[:10]
        usernames = [user.username for user in users]

        response = {
            'activity': ActivitySerializer(activity).data,
            'actions': ActionSerializer(actions, many=True).data,
            'users': usernames
        }

        return Response(response,status=status.HTTP_200_OK)

class CreateNewActionView(generics.CreateAPIView):
    serializer_class = ActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        activity = Activity.objects.get(pk=kwargs['pk'])
        
        distance = data.get('distance')
        if not distance:
            return Response({'error': 'Distance cannot empty'}, status=status.HTTP_404_NOT_FOUND)
        
        date = data.get('date')
        if not date:
            return Response({'error': 'Date can not be empty'}, status=status.HTTP_404_NOT_FOUND)
        
        date = datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z")
        # print('post: ',distance, date)
        activity.distance += distance
        activity.updated = datetime.now()
        username = data.get('username')
        user = CustomUser.objects.get(username=username)

        
        action = Action.objects.create(
            date = date,
            distance = distance,
            in_activity = activity,
            user = user
        )

        action.save()
        activity.actions.add(action)
        activity.save()
        
        # print(activity.actions)
        return Response({'distance': distance, 'date': date}, status=status.HTTP_201_CREATED)
    
class AllUserView(ModelViewSet):
    permission_classes = [permissions.AllowAny,]
    queryset = CustomUser.objects.all()
    pagination_class = UserPagination
    
    def retrieve(self, request, *args, **kwargs):
        search_query = self.request.query_params.get('search','')
        all_users = CustomUser.objects.all().order_by('username').filter(username__icontains=search_query)
        users_per_page = self.paginate_queryset(all_users)
        data = UserSerializer(users_per_page, many=True).data
    
        return self.get_paginated_response(data)

class AddUserToActvity(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        response = request.data
        usernames = response.get('newUsers')
        users = [CustomUser.objects.get(username=username) for username in usernames]

        activity = Activity.objects.get(pk=kwargs['pk'])
        for user in users:
            activity.users.add(user)
            
        activity.updated = datetime.now()
        activity.save()
        return Response({'users': UserSerializer(users, many=True).data}, status=status.HTTP_201_CREATED)

class AllUserActionInOneActivity(generics.RetrieveAPIView):
    permission_classes = [IsInActivity]
    def get(self, request, *args, **kwargs):
        activity = Activity.objects.get(pk=kwargs['pk'])
        actions = activity.actions.all()
        users = activity.users.all()
        actions_per_users = collections.defaultdict(list)
        for action in actions:
            actions_per_users[action.user.username].append(action)

        distance_per_users = collections.defaultdict(int)
        distance_per_user_per_days = collections.defaultdict(lambda: collections.defaultdict(int))
        
        terminate = activity.terminate.date()
        start = activity.start.date()
        now = datetime.now().date()
        # print(now.isoformat())

        end_date = now if terminate > now else terminate

        for username, acts in actions_per_users.items():
            distance_per_users[username] += sum(act.distance for act in acts)
            for act in sorted(acts, key=lambda k: k.date):
                # print(str(act.date.date()), act.distance)
                distance_per_user_per_days[username][act.date.date().isoformat()] += act.distance
        
        distance_per_user_series = collections.defaultdict(list)
        month = start.month
        nday = (end_date-start).days
        for username, distance_per_date in distance_per_user_per_days.items():
            for date in (start + timedelta(i) for i in range(nday+1)):
                if (date == start) or (date.month != month and date.day == 1):
                    display_time = f"{date.day}/{date.strftime('%B')}"
                else:
                    display_time = date.day
                if date.isoformat() in distance_per_date:
                    distance_per_user_series[username].append({'date': display_time, 'distance': distance_per_date[date.isoformat()]})
                else:
                    distance_per_user_series[username].append({'date':display_time, 'distance': 0})


        for user in users:
            distance_per_users[user.username] = distance_per_users.get(user.username,0)

        total_distance_series = [{'username': username, 'distance': distance} for username, distance in distance_per_users.items()]
        
        response = {
            'distance_per_user': total_distance_series,
            'distance_per_user_per_day': distance_per_user_series
        }

        return Response(response, status=status.HTTP_200_OK)

        

        











