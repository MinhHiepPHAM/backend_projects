from rest_framework import generics, permissions
from rest_framework import status
from . import serializers, models
import re
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import datetime
from rest_framework.viewsets import ModelViewSet


class RegistrationView(generics.CreateAPIView):
    serializer_class = serializers.RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def _is_valid_email(self, email):
        regex = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
        return re.match(regex, email)
    
    def post(self, request):
        username = request.data.get("username")
        if models.CustomUser.objects.filter(username=username):
            return Response({'error': 'Username is already used'}, status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get("email")
        if not self._is_valid_email(email):
            return Response({'error': 'Email is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        password1 = request.data.get("password1")
        password2 = request.data.get("password2")
        if password1 != password2:
             return Response({'error': 'Passwords are not identical'}, status=status.HTTP_400_BAD_REQUEST)
        if models.CustomUser.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = models.CustomUser.objects.create_user(
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
            uid = models.CustomUser.objects.get(username=username).pk
            return Response({'token': token.key, 'uid':uid}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid user or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            token = Token.objects.get(pk=request.data['token'])
            token.delete()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

class CreateNewBudget(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        participantInfos = request.data.get('userInfos')
        title = request.data.get('title')
        user = request.user
        isTitleInUsed = user.budgets.exists() and user.budgets.filter(title=title).exists()
        
        if isTitleInUsed:
            return Response(status=status.HTTP_409_CONFLICT)

        if not participantInfos: return Response(status=status.HTTP_200_OK)
        budget = models.Budget.objects.create(
            title = title,
            start = datetime.date.today(),
            owner = user,
            last_updated = datetime.date.today(),
            start_base = datetime.date.today()
        )
        
        budget.save()

        participants = []
        for info in participantInfos:
            new_participant = models.Participant.objects.create(
                username = info['username'],
                email = info['email'],
                payed = 0,
                in_budget = budget,
            )
            new_participant.save()
            participants.append(new_participant)
        
        return Response(status=status.HTTP_201_CREATED)
    
class AllBudgets(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.BudgetSerializer

    def retrieve(self, request, *args, **kwargs):
        budgets = request.user.budgets
        response = [
            {
                'amount': budget.get_budget_amount(),
                'participants': budget.get_participant_names(),
                'budget': self.serializer_class(budget).data
            }
            for budget in budgets.all()
        ]

        return Response(response, status=status.HTTP_200_OK)
    
class BudgetInfoView(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.BudgetSerializer

    def retrieve(self, request, *args, **kwargs):
        title = kwargs['title']
        budget = request.user.budgets.get(title=title)

        # for session in models.Session.objects.all():
        #     if not session.participants.exists():
        #         session.delete()

        response = {
            'amount': budget.get_budget_amount(),
            'participants': budget.get_participant_names(),
            'budget': self.serializer_class(budget).data,
            'sessions': serializers.SessionSerializer(budget.sessions, many=True).data,
            'categories': [category.name for category in budget.categories.all()],
        }

        return Response(response, status=status.HTTP_200_OK)

class AddNewMemberView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        title = kwargs['title']
        budget = request.user.budgets.get(title=title)
        new_member = request.data['newMember']
        new_email = request.data['newEmail']

        budget.participants.add(
            models.Participant.objects.create(
                username = new_member,
                email = new_email,
                payed = 0,
                in_budget = budget
            )
        )
        budget.last_updated = datetime.date.today()
        budget.save()

        return Response(status=status.HTTP_201_CREATED)

class AddNewSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        title = kwargs['title']
        budget = request.user.budgets.get(title=title)
        date = request.data['date']
        outcomes = request.data['outcomes']
        newCategories = request.data['newCategories']
        members = request.data['participants']
        date = datetime.datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z").date()


        participants = [
            budget.participants.get(username=participant)
            for participant in members
        ]

        for category in newCategories:
            models.Category.objects.create(name=category, in_budget=budget)

        new_outcomes = [
            models.Outcome.objects.create(
                cost=outcome['cost'],
                category=models.Category.objects.get(name=outcome['category'])
            )
            for outcome in outcomes
        ]

        session = models.Session.objects.create(
            date = date,
            in_budget = budget,
        )
        for outcome in new_outcomes:
            session.outcomes.add(outcome)
        
        for participant in participants:
            session.participants.add(participant)
        
        session.save()

        budget.last_updated = datetime.date.today()

        budget.save()

        
        return Response(status=status.HTTP_201_CREATED) 









 
