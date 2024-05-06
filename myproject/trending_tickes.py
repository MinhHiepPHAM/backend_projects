from bs4 import BeautifulSoup
import requests


def get_trending_tickers():
    url = 'https://finance.yahoo.com/lookup'
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
   
    screen = requests.get(url, headers=headers)
    soup = BeautifulSoup(screen.text,'html.parser')

    symbol_links = soup.find_all('a', class_='Fw(b)')
    return [symbol_link.text for symbol_link in symbol_links if 'data-symbol' in str(symbol_link)]



    
