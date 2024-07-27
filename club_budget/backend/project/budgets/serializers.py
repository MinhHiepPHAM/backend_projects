from .models import *
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password1', 'password2']

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['title', 'start']

class ParticipantSerializer(serializers.ModelSerializer):
    in_budget = BudgetSerializer()

    class Meta:
        model = Participant
        fields = ['username', 'email', 'payed', 'in_budget']

class CategorySerializer(serializers.ModelSerializer):
    in_budget = BudgetSerializer()

    class Meta:
        model = Category
        fields = ['name', 'in_budget']

class SessionSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True)
    category = CategorySerializer()

    class Meta:
        fields = ['date', 'payed', 'participants', 'category']

