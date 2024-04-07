import django
from django.conf import settings
settings.configure(
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'mydb',
            'USER': 'minh_hiep',
            'HOST': 'localhost',
            'PASSWORD': 'minh-hiep123',
            'port': 5432
        },
    },
    TIME_ZONE='Europe/Paris',
    # CACHES = {
    #     'default': {
    #         'BACKEND': 'django_redis.cache.RedisCache',
    #         'LOCATION': 'redis://localhost:6379/1',
    #         'OPTIONS': {
    #             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
    #         }
    #     }
    # }
)
django.setup()

import pandas as pd
import requests
import bs4
import time
from stock_price import models
import yfinance as yf
# from django.core.cache import cache

def get_stock_info(version):
    url = 'https://finviz.com/screener.ashx?v={version}&r={page}&f=all'
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
   
    screen = requests.get(url.format(version=version, page=1), headers=headers)
    soup = bs4.BeautifulSoup(screen.text,features="lxml")
    pages = soup.find_all('a', class_='screener-pages')

    num_page = int([page.text for page in pages if page.text.isnumeric()][-1])
      
    def get_data_in_all_page():
        for page in range(1, 20 * num_page, 20):
            screen = requests.get(url.format(version=version, page=page), headers=headers).text
            tables = pd.read_html(screen)
            tables = tables[-2]
            for name in tables:
                if name not in ['Ticker', 'Company', 'Sector', 'Industry', 'Country']:
                    tables = tables.drop(name,axis=1)

            yield tables
    return get_data_in_all_page()

def write_stock_info_to_db():
    stock_data = get_stock_info(version='111')
    
    for table in list(stock_data):
        for ticker, company, sector, industry, country in zip(table['Ticker'], table['Company'], table['Sector'], table['Industry'], table['Country']):  
            obj = models.StockModel.objects.filter(symbol=ticker)
            is_exist =  obj.exists()
            if is_exist:
                obj.update(country=country, sector=sector, industry=industry)
            else:
                try:
                    stock_price = yf.download(ticker,period='1d')
                except Exception:
                    print('Exception: Failed to download or wrong ticker: ',ticker)
                    continue
                 
                if stock_price.empty: continue
                models.StockModel.objects.create(
                    symbol = ticker,
                    company = company,
                    close_price = float("{:.2f}".format(stock_price['Close'][0])),
                    open_price = float("{:.2f}".format(stock_price['Open'][0])),
                    low_price = float("{:.2f}".format(stock_price['Low'][0])),
                    high_price = float("{:.2f}".format(stock_price['High'][0])),
                    adj_close_price = float("{:.2f}".format(stock_price['Adj Close'][0])),
                    volume = stock_price['Volume'][0],
                    is_trending = False,
                    sector = sector,
                    industry = industry,
                    country = country
                )

    
       
if __name__ == '__main__':
    start = time.time()
    write_stock_info_to_db()
    print(f'That tooks {(time.time()-start)/60} minutes to get all tickers')