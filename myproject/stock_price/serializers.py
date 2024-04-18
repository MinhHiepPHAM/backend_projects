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
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'username', 'is_active', 'bio', 'posts']


# class RegistrationSerializer(serializers.ModelSerializer):
#     """
#     Creates a new user.
#     Email, username, and password are required.
#     Returns a JSON web token.
#     """

#     # The password must be validated and should not be read by the client
#     password = serializers.CharField(
#         max_length=128,
#         min_length=8,
#         write_only=True,
#     )

#     # The client should not be able to send a token along with a registration
#     # request. Making `token` read-only handles that for us.
#     token = serializers.CharField(max_length=255, read_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ('email', 'username', 'password', 'token',)

#     def create(self, validated_data):
#         return CustomUser.objects.create_user(**validated_data)

class LoginSerializer(jwt_serializer.TokenObtainPairSerializer):
    def validate(self, attrs: jwt_serializer.Dict[str, jwt_serializer.Any]) -> jwt_serializer.Dict[str, str]:
        data = super().validate(attrs)
        data['username'] = self.user.username
        return data

