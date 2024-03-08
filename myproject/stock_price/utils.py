import requests
from django.conf import settings


def get_stock_price(symbols):
    base_url = 'https://www.alphavantage.co/query'
    function = 'GLOBAL_QUOTE'

    stock_prices = dict()
    for symbol in symbols:
        params = {
            'symbol': symbol,
            'apikey': settings.ALPHA_VANTAGE_API_KEY,
            'function': function,
        }

        try:
            response = requests.get(base_url, params=params)
            data = response.json()
            stock_prices[symbol] =  data['Global Quote']['05. price']  # Adjust this based on the actual API response
        except requests.RequestException as e:
            print(f"Error fetching stock data: {e}")
            
    return stock_prices
