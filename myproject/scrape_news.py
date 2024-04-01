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
from stock_price import utils
from stock_price import models
import time
import requests
import re

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

def scape_each_symbol(stock_object, options):
    driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=options)
    driver.set_window_size(1920, 1080)
    headlines, urls = get_urls(stock_object.symbol, driver)
    print('scrapping:', stock_object.symbol)

    for url, headline in zip(urls, headlines):
        if utils.check_news_in_db(url):
            print("Already exist in DB:",stock_object.symbol,headline)
            continue
        url_context = get_news_content(url)

        news = models.NewsModel(url=url,scrapped_date=date.today(),headline=headline,context=url_context)
        news.save()
        stock_object.related_news.add(news)

def scrape_stock_news(stock_objects):
    # driver_path = "/usr/local/bin/geckodriver"
    # Initialize WebDriver with headless mode to not open the new windown
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--blink-settings=imagesEnabled=false')

    # recent_news = utils.News()
    # recent_news = utils.read_recent_news_from_db()

    # args = ((symbol, options, recent_news) for symbol in symbols)

    for obj in stock_objects:
        scape_each_symbol(obj,options)

    # starttime = time.time()
    # pool = multiprocessing.Pool()
    # pool.starmap(scape_each_symbol, args)
    # pool.close()

    # print('That tooks {} minutes'.format((time.time() - starttime)/60))

def is_valid_url(url):
    regex = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return re.match(regex, url) is not None

def get_urls(symbol, driver):
    # Navigate to the URL
    url = f'https://finance.yahoo.com/quote/{symbol}/news/'
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
    home_url = 'https://finance.yahoo.com'
    # print(html_content)
    if html_content:
        # Parse the HTML content of the page
        soup = BeautifulSoup(html_content, 'html.parser')

        # Find all news articles
        news_articles = soup.find_all('h3', class_='Mb(5px)')

        # Extract news headlines and URLs   
        # print('XXX', symbol,news_articles)  
        for article in news_articles:
            headline = article.text
            url = article.find('a')['href']
            # print(url,is_active_url(url))
            if not is_valid_url(url): url = home_url + url
            headlines.append(headline)
            urls.append(url)

    return headlines, urls

def get_news_content(url):
    if not is_active_url(url):
        print('not active:', url)
        return
    reponse = requests.get(url,headers=headers)
    
    html_content = reponse.text
    soup = BeautifulSoup(html_content, 'html.parser')
    news_in_html = soup.find_all('div', class_='caas-body')
    all_content_in_text = []
    for content in news_in_html:
        article_content = content.find_all(re.compile('p|h2'))
        all_content_in_text.extend([cont.text for cont in article_content])
    return '\n'.join(all_content_in_text)
    
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
    # all_urls = models.NewsModel.objects.values_list('url',flat=True)
    all_objects = models.NewsModel.objects.all()

    for obj in all_objects:
        delete_invalid_url(obj)

if __name__ == '__main__':
    # current_path = Path(__file__).parent
    # path_to_all_symbols = os.path.join(current_path,'symbols.csv')
    # path_to_trending_symbols = os.path.join(current_path,'trending_ticker.csv')
    # trending_tickers =  pd.read_csv(path_to_trending_symbols, index_col=None, header=None)[0]
    # all_symbols = pd.read_csv(path_to_all_symbols)['Ticker']
    # # all_urls = models.NewsModel.objects.values_list('url',flat=True)
    start = time.time()
    # # check_all_url()
    # print(f'That tooks: {(time.time()-start)/60} minutes to check if url is active or not')
    # # print(trending_tickers['Ticker'])
    stock_objects = models.StockModel.objects.filter(is_trending=True)

    scrape_stock_news(stock_objects)
    # print(f'That tooks: {(time.time()-start)/60} minutes to scrap the news')
    # # scrape_stock_news(all_symbols)
    # print(all_symbols)
    # print(trending_tickers)


    