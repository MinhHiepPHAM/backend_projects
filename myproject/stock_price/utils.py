from django.conf import settings
import yfinance as yf
from matplotlib import pyplot as plt
import pandas as pd
import plotly.graph_objects as go 
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common import TimeoutException

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
    
    def download_data(self,symbol, period, interval):
        try:
            symbol = symbol.upper()
            data = yf.download(symbol,period=period,interval=interval)
        except:
            data = None
        
        self.data[symbol] = data

    def add_stock(self,symbol):
        stock = StockInfo(symbol)
        if self.period == '1d':
            interval = '60m'
        else:
            interval = '1d'
        self.download_data(symbol,self.period,interval)
        stock.close_price = stock.get_stock_price(self.data)
        stock.open_price = stock.get_open_price(self.data)
        stock.volume = stock.get_stock_volume(self.data)
        stock.change = stock.get_stock_change()
        self.stocks.add(stock)
    
    def get_stock(self,symbol):
        for stock in self.stocks:
            if stock.symbol == symbol: return stock
        return None # TODO:create None stock is better ?

    def get_time_span(self,data_frame, period):
        if period == '1d':
            timespan = pd.to_datetime(data_frame.index.hour.astype(str) + ':' + data_frame.index.minute.astype(str), format='%H:%M').time
        else:
            timespan = data_frame.index
        return timespan
    
    def plot_stock(self, symbol, period):

        data = self.data[symbol]
        df = pd.DataFrame(data)

        timespan = self.get_time_span(df,period)
        
        fig = go.Figure()

        # Add trace for stock prices
        fig.add_trace(go.Scatter(x=timespan, y=df['Adj Close'], mode='lines+markers', name='Stock Price', 
                                line=dict(color='blue', width=1),
                                marker=dict(color='blue', size=3),
                                hoverinfo='y'))

        # Update layout
        if period == '1d':
            tickformat = 'HH:MM'
        else:
            tickformat = '%m-%d-%Y'
        fig.update_layout(
            title=f'Stock Price of {symbol} ({self.get_stock(symbol).change}$)',
            xaxis=dict(title='Time', tickformat=tickformat, showgrid=False),
            yaxis=dict(title='Price', showgrid=False),
            showlegend=True,
            legend=dict(x=0, y=1.1, orientation='h'),
            plot_bgcolor='white',
            # autosize=True,
            margin=dict(l=40, r=40, t=80, b=40),
        )

        return fig.to_html(full_html=False)
    
class StockNew:
    def __init__(self, url, headline):
        self.url = url
        self.headline = headline

    def __eq__(self, other: object):
        return self.url == other.url and self.headline == other.headline
    
    def __hash__(self) -> int:
        return hash(self.url,self.headline)

class News:
    def __init__(self):
        self.stock_news = dict() # new per stock symbol

    def add_new(self, symbol, url, headline):
        new = StockNew(url,headline)
        if symbol in self.stock_news:
            self.stock_news[symbol] = {new}
        else:
            self.stock_news[symbol].add(new)


    def scrape_stock_news(self,symbol):
        driver_path = "/usr/local/bin/geckodriver"

        # Initialize WebDriver with headless mode to not open the new windown
        options = Options()
        options.add_argument('--headless')

        driver = webdriver.Chrome(service=Service(GeckoDriverManager().install()), options=options)

        url = 'https://finance.yahoo.com/quote/QCOM/news/'
        driver.set_window_size(1920, 1080)

        # Navigate to the URL
        driver.get(url)
        try:
            # wait up to 3 seconds for the consent modal to show up
            consent_overlay = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.CSS_SELECTOR, '.consent-overlay')))

            # click the "Accept all" button
            accept_all_button = consent_overlay.find_element(By.CSS_SELECTOR, '.accept-all')
            accept_all_button.click()
        except TimeoutException:
            print('Cookie consent overlay missing')

        # Get the HTML content after JavaScript execution
        html_content = driver.page_source

        # Close the browser
        driver.quit()

        headlines = []
        urls = []
        if html_content:
            # Parse the HTML content of the page
            soup = BeautifulSoup(html_content, 'html.parser')

            # Find all news articles
            news_articles = soup.find_all('h3', class_='Mb(5px)')

            # Extract news headlines and URLs     
            for article in news_articles:
                headline = article.text
                url = article.find('a')['href']
                headlines.append(headline)
                urls.append(url)

        return headlines, urls
        



