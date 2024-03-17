import requests
from django.conf import settings
import yfinance as yf
from matplotlib import pyplot as plt
import pandas as pd
import io
import base64

class StockInfo:
    def __init__(self, symbol):
        self.symbol = symbol
        self.close_price = 0
        self.open_price = 0
        self.volume = 0
        self.change = 0
    
    def get_stock_price(self, data):
        if data:
            return float("{:.2f}".format(data[self.symbol]['Close'][-1]))
        else:
            return 0
    
    def get_open_price(self, data):
        if data:
            return float("{:.2f}".format(data[self.symbol]['Open'][0]))
        else:
            return 0
        
    def get_stock_volume(self, data):
        if data:
            return data[self.symbol]['Volume'][-1]
        else:
            return 0
        
    def get_stock_change(self):
        return float("{:.2f}".format(self.close_price-self.open_price))
    
    def __eq__(self, other):
        return self.symbol.lower() == self.other.symbol.lower()
    
    def __hash__(self) -> int:
        return hash(self.symbol)

class StockData:
    def __init__(self, period) -> None:
        self.period = period
        self.data = dict()
        self.stocks = set()
    
    def download_data(self,symbol, period):
        try:
            symbol = symbol.upper()
            data = yf.download(symbol,period=period)
        except:
            data = None
        
        self.data[symbol] = data

    def add_stock(self,symbol):
        stock = StockInfo(symbol)
        self.download_data(symbol,self.period)
        stock.close_price = stock.get_stock_price(self.data)
        stock.open_price = stock.get_open_price(self.data)
        stock.volume = stock.get_stock_volume(self.data)
        stock.change = stock.get_stock_change()
        self.stocks.add(stock)
    
    def get_stock(self,symbol):
        for stock in self.stocks:
            if stock.symbol == symbol: return stock
        return None # TODO:create None stock is better ?   

    def plot_stock(self, symbol):
        data = self.data[symbol]
        close_prices = pd.DataFrame(data)['Adj Close']
        plt.plot(close_prices)
        plt.title('Stock Price Modification')
        plt.xlabel('Date')
        plt.ylabel('Price')
        # plt.grid(True)

        # Save the plot as a PNG image
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        img_str = base64.b64encode(buffer.read()).decode()
        # Generate HTML to display the image
        return f'<img src="data:image/png;base64,{img_str}" alt="Stock Price Modification">'
        