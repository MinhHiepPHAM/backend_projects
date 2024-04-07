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
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': 'redis://localhost:6379/1',
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            }
        }
    }
)
django.setup()
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common import TimeoutException
from datetime import date
import pandas as pd
import time
from pathlib import Path
import os
from stock_price import models
from django.core.cache import cache

def get_trending_symbols():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--blink-settings=imagesEnabled=false')
    driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=options)
    driver.set_window_size(1920, 1080)

    url = 'https://finance.yahoo.com/lookup'
    driver.get(url)
    try:
        # wait up to 3 seconds for the consent modal to show up
        consent_overlay = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.CSS_SELECTOR, '.consent-overlay')))

        # click the "Accept all" button
        accept_all_button = consent_overlay.find_element(By.CSS_SELECTOR, '.accept-all')
        accept_all_button.click()
    except TimeoutException:
        print('Cookie consent overlay missing')
    
    html_content = driver.page_source
    if not html_content: return []

    # Close the browser
    driver.quit()

    soup = BeautifulSoup(html_content, 'html.parser')
    symbol_links = soup.find_all('a', class_='Fw(b)')
    return [symbol_link.text for symbol_link in symbol_links if 'data-symbol' in str(symbol_link)]

def update_db_with_trending_ticker():
    trending_tickers = get_trending_symbols()
    old_trending_objs = models.StockModel.objects.filter(is_trending=True)
    for obj in old_trending_objs:
        obj.is_trending=False
        obj.save()
    cache.delete('trending_stock')
    for ticker in trending_tickers:
        obj = models.StockModel.objects.filter(symbol=ticker)
        obj.update(is_trending=True)


if __name__ == '__main__':
    update_db_with_trending_ticker()


    
