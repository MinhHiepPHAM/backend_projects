from django.shortcuts import render, redirect
from .utils import *
from django.http import JsonResponse
# from django.views.decorators.cache import cache_page
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response
# from django.core import serializers
from .serializers import *
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .pagination import HomePagination
from .task import get_all_stock_objects
from rest_framework import status

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
    # queryset = StockModel.objects.all()
    pagination_class = HomePagination

    def get_queryset(self):
        get_all_stock_objects.delay()
        return StockModel.objects.all().order_by('symbol')
    
class TickerView(ModelViewSet):
    serializer_class = StockSerializer
    queryset = StockModel.objects.all()
    def retrieve(self, request, symbol, period='1d'):
        try:
            ticker_obj = StockModel.objects.get(symbol=symbol)
            serializer = StockSerializer(ticker_obj)
            data = serializer.data
            interval = '30m' if period == '1d' else '1d'

            print(interval, period)
                
            stock_prices = yf.download(symbol, period=period, interval=interval)
            data['stock_prices'] = stock_prices.to_json()
            return Response(data)
        except StockModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)



            
