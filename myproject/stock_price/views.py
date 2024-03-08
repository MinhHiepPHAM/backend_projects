from django.shortcuts import render

# stock/views.py

from django.shortcuts import render
from .utils import get_stock_price

def stock_price(request):
    symbol = 'QCOM'  # Replace with the desired stock symbol

    stock_price = get_stock_price(symbol)

    return render(request, 'stock/stock_price.html', {'stock_price': stock_price})

