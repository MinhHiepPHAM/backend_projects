from .models import NewsModel, StockModel
from rest_framework import serializers

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