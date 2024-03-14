from django.shortcuts import render, redirect
from .utils import get_stock_price
from .forms import StockForm
from django.http import HttpResponseNotFound, JsonResponse
from django.http.response import HttpResponse
import pandas as pd
import csv

symbols = {'QCOM', 'AAPL', 'GOOGL'}

def stock_price(request):

    new_stock = add_stock(request)
    
    if symbol := new_stock['symbol']: symbols.add(symbol)
    if period := period_selection(request):
        pass
    else:
        period = '1d'
    stock_prices, stock_volumes, stock_changes = get_stock_price(sorted(symbols),period)

    periods = get_period_options()
    
    context = {
        'stock_prices': stock_prices,
        'stock_volumes': stock_volumes,
        'stock_changes': stock_changes,
        'user':request.user,
        'stock_form': new_stock['form'],
        'options':periods,
        'period':period
    }
    

    return render(request, 'stock/stock_price.html', context)


def add_stock(request):
    symbol = None
    if request.method == 'POST':
        form = StockForm(request.POST)
        if form.is_valid():
            form.save()
            symbol = form.cleaned_data['symbol']
            print('add_stock', symbol)
    else:
        form = StockForm()

    new_stock = {'form': form, 'symbol': symbol}
    
    return new_stock

def search_csv(request):
    query = request.GET.get('q', '')
    results = []
    # df = pd.read_csv('stock_price/symbols.csv')
    # for i,symbol in enumerate(df['symbol']):
    #     if query.lower() in symbol.lower(): results.append(df[i])

    with open('stock_price/symbols.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if query.lower() in row['symbol'].lower():
                results.append(row)

    return JsonResponse(results, safe=False)

def get_period_options():
    intervals = ['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','ytd','max']
    labels = ['1 day','5 day','1 month','3 months','6 months','1 year','2 years','5 years','10 years','Year to date','All']

    options = [
        {'value': interval, 'label': label}
        for interval, label in zip(intervals,labels)
    ]

    return options

def period_selection(request):
    selected_option = request.POST.get('mySelect')
    if selected_option:
        return selected_option
    else:
        return None