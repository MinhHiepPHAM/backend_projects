import requests

def get_stock_price(symbol, api_key):
    base_url = 'https://www.alphavantage.co/query'
    function = 'GLOBAL_QUOTE'
    params = {
        'symbol': symbol,
        'apikey': api_key,
        'function': function,
    }

    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        return data['Global Quote']['05. price']  # Adjust this based on the actual API response
    except requests.RequestException as e:
        print(f"Error fetching stock data: {e}")
        return None
