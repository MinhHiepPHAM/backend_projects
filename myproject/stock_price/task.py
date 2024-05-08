from celery import shared_task
from .models import StockModel
import yfinance as yf
from stock_price import models
from trending_tickes import get_trending_tickers
from scrape_news import get_urls, get_news_content
from .utils import check_news_in_db
from datetime import date
# from django.core.cache import cache

@shared_task
def update_all_stock_objects():
    all_stock_objs = StockModel.objects.all()
    for obj in all_stock_objs:
        try:
            stock_price = yf.download(obj.symbol,period='1d')
            obj.close_price = float("{:.2f}".format(stock_price['Close'][0]))
            obj.open_price = float("{:.2f}".format(stock_price['Open'][0]))
            obj.low_price = float("{:.2f}".format(stock_price['Low'][0]))
            obj.high_price = float("{:.2f}".format(stock_price['High'][0]))
            obj.adj_close_price = float("{:.2f}".format(stock_price['Adj Close'][0]))
            obj.volume = stock_price['Volume'][0]
            obj.save()
        except:
            obj.delete()

    return all_stock_objs

@shared_task
def update_db_with_trending_ticker():
    trending_tickers = get_trending_tickers()
    # print(len(trending_tickers), trending_tickers)
    old_trending_objs = models.StockModel.objects.filter(is_trending=True)
    for obj in old_trending_objs:
        obj.is_trending=False
        obj.save()
    # cache.delete('trending_stock')
    for ticker in trending_tickers:
        obj = models.StockModel.objects.filter(symbol=ticker)
        obj.update(is_trending=True)

def scrape_related_news():
    for obj in models.StockModel.objects.all():
        headlines, urls = get_urls(obj.symbol)

        # cache_pattern = f'*{obj.symbol}_*'
        # cache.delete_many(keys=cache.keys(cache_pattern))

        for url, headline in zip(urls, headlines):
            try:
                if check_news_in_db(url):
                    # print("Already exist in DB:",stock_object.symbol,headline)
                    continue
                url_context = get_news_content(url)
                if not url_context: continue 

                news = models.NewsModel(url=url,scrapped_date=date.today(),headline=headline,context=url_context)
                news.save()
                obj.related_news.add(news)
            except:
                pass