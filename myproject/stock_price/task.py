from celery import shared_task
from .models import StockModel
import yfinance as yf

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