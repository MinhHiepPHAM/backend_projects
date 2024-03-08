from django.shortcuts import render

# stock/views.py

from django.shortcuts import render
from .utils import get_stock_price

def stock_price(request):
    symbol = 'QCOM'  # Replace with the desired stock symbol
    api_key = '4OBG2FO0CKPC1T3W'  # Replace with your actual API key

    stock_price = get_stock_price(symbol, api_key)

    return render(request, 'stock/stock_price.html', {'stock_price': stock_price})

