from django.shortcuts import render, redirect
from .utils import StockData, News
from django.http import JsonResponse
import pandas as pd
import csv

SYMBOLS = {'QCOM', 'AAPL', 'GOOGL'}
PERIOD = '1d'
SYMBOL = 'QCOM'


def get_period_options():
    intervals = ['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','ytd','max']
    labels = ['1 day','5 day','1 month','3 months','6 months','1 year','2 years','5 years','10 years','Year to date','All']

    options = [
        {'value': interval, 'label': label}
        for interval, label in zip(intervals,labels)
    ]

    return options
periods = get_period_options()

def stock_price(request):

    new_stock_symbol = add_new_stock(request)
    
    if symbol := new_stock_symbol: SYMBOLS.add(symbol)
    global PERIOD
    if period:=period_selection(request):
        PERIOD = period

    stock_data = StockData(PERIOD)
    for symbol in SYMBOLS:
        stock_data.add_stock(symbol)

    global SYMBOL
    if sym:= symbol_selection(request): SYMBOL = sym
    plot_html = stock_data.plot_stock(SYMBOL, PERIOD)
    
    news = News()
    news.read_recent_news_from_db()
    # TODO: add to for loop to display the news of all stocks
    stock_news = list(news.new_per_symbol[SYMBOL])[:15]
    
    context = {
        'user':request.user,
        'options':periods,
        'stock_data': stock_data,
        'plot_html':plot_html,
        'plot_symbol':SYMBOL,
        'symbols': SYMBOLS,
        'news': stock_news,
        # 'urls': urls,
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