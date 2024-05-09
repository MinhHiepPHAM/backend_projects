from stock_price import models
from django.core.cache import cache
import requests

def check_news_in_db(url):
    try:
        news_objects = models.NewsModel.objects.filter(url=url)
        return news_objects.exists()
    except Exception:
        return False
    
def get_trending_stocks():
    cache_key = 'trending_stock'
    if objects := cache.get(cache_key):
        print('in redis cache')
        return objects

    try:
        objects = models.StockModel.objects.filter(is_trending=True)
        # print(len(objects))
    except Exception:
        return models.StockModel.objects.none()
    cache.add(cache_key,objects,timeout=60*15)

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
