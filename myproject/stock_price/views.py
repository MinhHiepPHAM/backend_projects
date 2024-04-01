from django.shortcuts import render, redirect
from .utils import *
from django.http import JsonResponse
import csv
from django.views.decorators.cache import cache_page
from django.core.cache import cache

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
periods = get_period_options()

# @cache_page(60*2)
def stock_price(request):
    global PERIOD
    if period:=period_selection(request):
        PERIOD = period

    stock_trending_objs = models.StockModel.objects.filter(is_trending=True)
    SYMBOLS = [obj.symbol for obj in stock_trending_objs]
    global SYMBOL
    if not SYMBOL: SYMBOL = SYMBOLS[0]
    if sym:= symbol_selection(request): SYMBOL = sym

    stock_obj = models.StockModel.objects.get(symbol=SYMBOL)
    stock_change = float("{:.2f}".format(stock_obj.adj_close_price-stock_obj.open_price))
    
    plot_html = plot_stock([SYMBOL], PERIOD, f'Stock Price of {SYMBOL}({stock_change}$)')
    
    top_five_plot_html = plot_stock(SYMBOLS[:5], PERIOD, "Top five trending tickers")

    recent_news = read_recent_news_from_db()
    
    context = {
        'user':request.user,
        'options':periods,
        # 'stock_data': stock_data,
        'plot_html':plot_html,
        'top_five_plot_html':top_five_plot_html,
        'plot_symbol':SYMBOL,
        'symbols': SYMBOLS,
        'news': recent_news[:8],
        'trending': stock_trending_objs,
        'period': PERIOD
    }
    

    return render(request, 'stock/stock_price.html', context)


def add_new_stock(request):
    return request.POST.get('symbol')

def search_csv(request):
    query = request.GET.get('q', '')
    results = []

    with open('stock_price/symbols.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if query.lower() in row['symbol'].lower():
                results.append(row)

    return JsonResponse(results, safe=False)

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

def ticker_view(request,symbol):
    global PERIOD
    if period:=period_selection(request):
        PERIOD = period
    stock_obj = models.StockModel.objects.get(symbol=symbol)

    plot_html = plot_stock([symbol],PERIOD, "Stock price")

    stock_news = read_recent_news_from_db()[:15]

    context = {
        'plot_html': plot_html,
        'period':PERIOD,
        'options':get_period_options(),
        'stock': stock_obj,
        'news': stock_news
    }
    return render(request, 'stock/ticker.html',context)
