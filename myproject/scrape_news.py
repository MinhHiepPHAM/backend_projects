from bs4 import BeautifulSoup
from stock_price import utils
import requests
import re

def is_valid_url(url):
    regex = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return re.match(regex, url) is not None

def get_urls(symbol):
    # Navigate to the URL
    url = f'https://finance.yahoo.com/quote/{symbol}/news/'

    headlines = []
    urls = []
    response = requests.get(url, headers=utils.headers)

    
    if response.status_code != 200: return headlines, urls
    # Parse the HTML content of the page
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all news articles
    news_articles = soup.find_all('a', class_="svelte-wdkn18")

    # Extract news headlines and URLs   
    for article in news_articles:
        try:
            url = article['href']
            headline = article['title']
            headlines.append(headline)
            urls.append(url)
        except:
            pass
    return headlines, urls

def get_news_content(url):
    if not utils.is_active_url(url):
        # print('not active:', url)
        return
    reponse = requests.get(url,headers=utils.headers)

    if reponse.status_code != 200: return
    
    html_content = reponse.text
    soup = BeautifulSoup(html_content, 'html.parser')
    news_in_html = soup.find_all('div', class_='caas-body')
    all_content_in_text = []
    for content in news_in_html:
        article_content = content.find_all(re.compile('p|h2'))
        all_content_in_text.extend([cont.text for cont in article_content])
    return '\n'.join(all_content_in_text)

    