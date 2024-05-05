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
from .pagination import HomePagination
from .task import update_all_stock_objects
from rest_framework import status
import pprint
from django.db.models import Q

# SYMBOLS = {'QCOM', 'AAPL', 'GOOGL'}
PERIOD = '1mo'
SYMBOL = None


def get_period_options():
    intervals = ['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','ytd','max']
    labels = ['1 day','5 day','1 month','3 months','6 months','1 year','2 years','5 years','10 years','Year to date','All']

    options = [
        {'value': interval, 'label': label}
        for interval, label in zip(intervals,labels)
    ]

    return options
PERIODS = get_period_options()

@api_view(['GET'])
def trending_stock_view(request):
    global PERIOD
    if period:=period_selection(request):
        PERIOD = period

    stock_trending_objs = get_trending_stocks()
    SYMBOLS = [obj.symbol for obj in stock_trending_objs]
    global SYMBOL
    if not SYMBOL: SYMBOL = SYMBOLS[0]
    if sym:= symbol_selection(request): SYMBOL = sym

    stock_obj = models.StockModel.objects.get(symbol=SYMBOL)
    # stock_change = float("{:.2f}".format(stock_obj.adj_close_price-stock_obj.open_price))
    
    # plot_html = plot_stock([SYMBOL], PERIOD, f'Stock Price of {SYMBOL}: {stock_obj.company}({stock_change}$)')
    
    # top_five_plot_html = plot_stock(SYMBOLS[:5], PERIOD, "Top five trending tickers")

    recent_news = get_stock_news_from_db(SYMBOL)

    recent_news_serilizers = NewsSerializer(recent_news, many=True)
    stock_trending_serializers = StockSerializer(stock_trending_objs, many=True)
    
    context = {
        'is_authenticated':request.user.is_authenticated,
        'options':PERIODS,
        # 'plot_html':plot_html,
        # 'top_five_plot_html':top_five_plot_html,
        'plot_symbol':SYMBOL,
        'symbols': SYMBOLS,
        'news': recent_news_serilizers.data,
        'trending': stock_trending_serializers.data,
        'period': PERIOD
    }
    
    return Response(context)


def add_new_stock(request):
    return request.POST.get('symbol')

def search_symbol(request):
    query = request.GET.get('q', '')
    results = StockModel.objects.filter(symbol__icontains=query).values()

    return JsonResponse(list(results), safe=False)

def period_selection(request):
    selected_option = request.POST.get('period-selection')
    if selected_option:
        return selected_option
    else:
        return None
    
def symbol_selection(request):
    selected_option = request.POST.get('symbol-selection')
    if selected_option:
        return selected_option
    else:
        return None

@api_view(['GET'])
def ticker_view(request,symbol):
    global PERIOD
    if period:=period_selection(request):
        PERIOD = period
    # print('ticker view:',symbol)
    stock_obj = models.StockModel.objects.get(symbol=symbol)
    print(type(stock_obj))

    stock_serializer = StockSerializer(stock_obj)

    plot_html = plot_stock([symbol],PERIOD, f'{stock_obj.symbol}: {stock_obj.company}')

    stock_news = get_stock_news_from_db(symbol)
    news_serializers = NewsSerializer(stock_news, many=True)

    context = {
        'plot_html': plot_html,
        'period':PERIOD,
        'options':get_period_options(),
        'stock': stock_serializer.data,
        'news': news_serializers.data,
    }
    return Response(context)

@api_view(['GET'])
def search_news(request):
    input_text = request, request.GET.get('search')
    results = models.NewsModel.objects.filter(context__search=input_text)
    results_serializers = NewsSerializer(results, many=True)
    context = {'results':results_serializers.data}
    return Response(context)


class HomeView(ModelViewSet):
    serializer_class = StockSerializer
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
        print('check_company', checked_company)
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
    def retrieve(self, request, symbol, period='1d'):
        try:
            ticker_obj = StockModel.objects.get(symbol=symbol)
            serializer = StockSerializer(ticker_obj)
            interval = '30m' if period == '1d' else '1d'
            stock_prices = yf.download(symbol, period=period, interval=interval)
            stock_prices = stock_prices.rename(columns={'Close': 'close', 'High':'high', 'Open':'open', 'Low':'low', 'Volume':'volume', 'Date':'date'})
            stock_prices.index.names = ['date']
            data = {'item':serializer.data}
            data['stock_prices'] = stock_prices.to_json(orient ='table',double_precision=2)
            # pprint.pprint(data['stock_prices'])
            return Response(data)
        except StockModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)