import yfinance as yf
import pandas as pd
import plotly.graph_objects as go 
from stock_price import models
# from cache_mixin import *
from django.core.cache import cache
import requests

def get_time_span(data_frame, period):
    if period == '1d':
        timespan = pd.to_datetime(data_frame.index.hour.astype(str) + ':' + data_frame.index.minute.astype(str), format='%H:%M').time
    else:
        timespan = data_frame.index
    return timespan
    
def plot_stock(symbols, period, title):
    fig = go.Figure()
    colors = ['blue', 'red', '#cc8c14', '#28a317', 'black']
    
    interval = '60m' if period == '1d' else '1d'
    for i, symbol in enumerate(symbols):
        close_prices = yf.download(symbol,period=period,interval=interval)['Adj Close']
        timespan = get_time_span(close_prices,period)
        
        # Add trace for stock prices
        fig.add_trace(go.Scatter(x=timespan, y=close_prices, mode='lines+markers', name=symbol, 
            line=dict(color=colors[i], width=1), marker=dict(color=colors[i], size=3), hoverinfo='y'))

    # Update layout
    if period == '1d':
        tickformat = 'HH:MM'
    else:
        tickformat = '%m-%d-%Y'
    fig.update_layout(
        title=title,
        xaxis=dict(title='Time', tickformat=tickformat, showgrid=False),
        yaxis=dict(title='Price', showgrid=False),
        showlegend=True,
        legend=dict(x=0, y=1.1, orientation='h'),
        plot_bgcolor='white',
        # autosize=True,
        margin=dict(l=40, r=40, t=80, b=40),
    )

    return fig.to_html(full_html=False)

def get_stock_news_from_db(ticker, limit=15):
    cache_key = f'news_{ticker}_{limit}'
    if news_objects := cache.get(cache_key): return news_objects#[:limit]

    try:
        news_objects = models.StockModel.objects.get(symbol=ticker).related_news.all().order_by('-scrapped_date')
    except Exception:
        return models.NewsModel.objects.none()
    cache.add(cache_key,news_objects, timeout=60*15)

    return news_objects#[:limit]

def check_news_in_db(url):
    try:
        news_objects = models.NewsModel.objects.filter(url=url)
        return news_objects.exists()
    except Exception:
        return False
    
def get_trending_stocks():
    cache_key = 'trending_stock'
    # if objects := cache.get(cache_key):
    #     print('in redis cache')
    #     return objects

    try:
        objects = models.StockModel.objects.filter(is_trending=True)
        # print(len(objects))
    except Exception:
        return models.StockModel.objects.none()
    # cache.add(cache_key,objects,timeout=60)

    return objects

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

def is_active_url(url):
    try:
        code = requests.get(url,headers=headers).status_code
        return code == 200
    except Exception as e:
        print('UNACTIVE URL OR INVALID URL', url)
        return False

def delete_invalid_url(obj):
    if not is_active_url(obj.url): models.NewsModel.delete(obj)

def check_all_url():
    all_objects = models.NewsModel.objects.all()

    for obj in all_objects:
        delete_invalid_url(obj)
