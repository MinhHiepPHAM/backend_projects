from django.shortcuts import render, redirect
from .utils import *
from django.http import JsonResponse
# from django.views.decorators.cache import cache_page
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from django.core import serializers
from .serializers import *
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .pagination import HomePagination, NewsPagination
from .task import update_all_stock_objects, update_db_with_trending_ticker, scrape_related_news
from rest_framework import status
import pprint
from django.db.models import Q

class HomeView(ModelViewSet):
    serializer_class = HomeStockSerializer
    pagination_class = HomePagination

    def get_queryset(self):
        update_all_stock_objects.delay()
        checked = lambda query: query == 'true'
        search_query = self.request.query_params.get('search','')
        checked_country = checked(self.request.query_params.get('country',''))
        checked_company = checked(self.request.query_params.get('company',''))
        checked_sector = checked(self.request.query_params.get('sector',''))
        checked_industry = checked(self.request.query_params.get('industry',''))


        query = Q(symbol__icontains=search_query)
        # print('check_company', checked_company)
        if checked_company:
            query |=  Q(company__icontains=search_query)# can also use  the add function: add(Q(company__icontains=search_query),'OR')
        
        if checked_country:
            query |=  Q(country__icontains=search_query)

        if checked_sector:
            query |=  Q(sector__icontains=search_query)

        if checked_industry:
            query |=  Q(industry__icontains=search_query)

        # print(query)
        return StockModel.objects.filter(query).order_by('symbol')
    
    
class TickerView(ModelViewSet):
    serializer_class = StockSerializer
    queryset = StockModel.objects.all()
    def get_queryset(self,symbol):
        return StockModel.objects.filter(symbol = symbol)

    def retrieve(self, request, symbol, period):
        try:
            ticker_obj = StockModel.objects.get(symbol=symbol)
            serializer = StockSerializer(ticker_obj)
            interval = '30m' if period == '1d' else '1d'
            stock_prices = yf.download(symbol, period=period, interval=interval)
            stock_prices = stock_prices.rename(columns={'Close': 'close', 'High':'high', 'Open':'open', 'Low':'low', 'Volume':'volume', 'Date':'date'})
            stock_prices.index.names = ['date']
            data = {'item':serializer.data}
            data['stock_prices'] = stock_prices.to_json(orient ='table',double_precision=2)
            return Response(data)
        except StockModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class TrendingView(ModelViewSet):
    serializer_class = StockSerializer

    def get_queryset(self):
        update_db_with_trending_ticker.delay()
        return get_trending_stocks()
    
class NewsView(ModelViewSet):
    serializer_class = NewsSerializer
    pagination_class = NewsPagination

    def get_queryset(self):
        scrape_related_news.delay()
        search_query = self.request.query_params.get('search','')
        query = Q(headline__icontains=search_query)
        query |= Q(context__icontains=search_query)
        return NewsModel.objects.filter(query).order_by('scrapped_date').order_by('headline')


        