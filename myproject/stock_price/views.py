from django.shortcuts import render

# stock/views.py

from django.shortcuts import render
from .utils import get_stock_price

def stock_price(request):
    symbols = ['QCOM', 'AAPL', 'GOOGL']  # Replace with the desired stock symbol

    stock_prices = get_stock_price(symbols)

    return render(request, 'stock/stock_price.html', {'stock_prices': stock_prices, 'user':request.user})

