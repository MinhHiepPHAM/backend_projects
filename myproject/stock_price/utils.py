import requests
from django.conf import settings
import yfinance as yf


def get_stock_price(symbols):
    # base_url = 'https://www.alphavantage.co/query'
    # function = 'GLOBAL_QUOTE'

    stock_prices = dict()
    stock_volumes = dict()
    stock_changes = dict()
    for symbol in symbols:
        # params = {
        #     'symbol': symbol,
        #     'apikey': settings.ALPHA_VANTAGE_API_KEY,
        #     'function': function,
        # }

        try:
            data = yf.download(symbol, period="1d")
            #print(data)
            stock_prices[symbol] =  float("{:.2f}".format(data['Close'][0]))  # Adjust this based on the actual API response
            stock_volumes[symbol] = data['Volume'][0]
            stock_changes[symbol] = float("{:.2f}".format(data['High'][0]-data['Low'][0]))
        except KeyError:
            print(f"Error fetching stock data: {e}, {symbol}")
            stock_prices[symbol] = None
            stock_volumes[symbol] = None
            stock_changes[symbol] = None
            
    return stock_prices, stock_volumes, stock_changes
