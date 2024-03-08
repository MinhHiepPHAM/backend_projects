import requests
from django.conf import settings


def get_stock_price(symbol):
    base_url = 'https://www.alphavantage.co/query'
    function = 'GLOBAL_QUOTE'
    params = {
        'symbol': symbol,
        'apikey': settings.ALPHA_VANTAGE_API_KEY,
        'function': function,
    }

    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        return data['Global Quote']['05. price']  # Adjust this based on the actual API response
    except requests.RequestException as e:
        print(f"Error fetching stock data: {e}")
        return None
