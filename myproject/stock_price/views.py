from django.shortcuts import render, redirect
from .utils import get_stock_price
from .forms import StockForm
from django.http import HttpResponseNotFound, JsonResponse
from django.http.response import HttpResponse
import pandas as pd

def stock_price(request):
    symbols = {'QCOM', 'AAPL', 'GOOGL'}

    new_stock = add_stock(request)
    
    if symbol := new_stock['symbol']: symbols.add(symbol)
    stock_prices, stock_volumes, stock_changes = get_stock_price(sorted(symbols))

    context = {'stock_prices': stock_prices,
        'stock_volumes': stock_volumes,
        'stock_changes': stock_changes,
        'user':request.user,
        'stock_form': new_stock['form']
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

import csv
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