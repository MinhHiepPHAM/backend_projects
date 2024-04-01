import yfinance as yf
# from matplotlib import pyplot as plt
import pandas as pd
import plotly.graph_objects as go 
from datetime import datetime, timedelta
from stock_price import models

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

def read_recent_news_from_db(nday=7):
    interval = datetime.now() - timedelta(days=nday)
    try:
        news_objects = models.NewsModel.objects.filter(scrapped_date__gte=interval).order_by('-scrapped_date')
    except Exception:
        print(f'Exception: there have been no news since {nday} days.')
        news_objects = models.NewsModel.objects.none()

    return news_objects

def check_news_in_db(url):
    try:
        news_objects = models.NewsModel.objects.filter(url=url)
        return news_objects.exists()
    except Exception:
        return False
    
