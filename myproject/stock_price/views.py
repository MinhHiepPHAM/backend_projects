from django.shortcuts import render, redirect
from .utils import get_stock_price
from .forms import StockForm
from django.http import HttpResponseNotFound
from django.http.response import HttpResponse

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