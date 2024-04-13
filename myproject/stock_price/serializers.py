from .models import *
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializer

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsModel
        fields = ['url', 'scrapped_date', 'headline', 'context']

class StockSerializer(serializers.ModelSerializer):
    related_news = NewsSerializer(many=True)
    class Meta:
        model = StockModel
        fields = ['symbol', 'company', 'close_price', 'open_price', 'low_price', 'high_price',
            'adj_close_price', 'volume', 'sector', 'industry', 'country', 'related_news'
        ]

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['created_time', 'title', 'context']

class UserSerilalizer(serializers.ModelSerializer):
    posts = PostSerializer(many=True)
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'username', 'is_active', 'bio', 'posts']

class TokenObtainPairSerializer(jwt_serializer.TokenObtainPairSerializer): pass
