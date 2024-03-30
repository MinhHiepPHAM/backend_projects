import pandas as pd
import requests
import bs4
import time

def get_screener(version):
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
    data = get_data_in_all_page()

    return pd.concat(data).reset_index().drop('index',axis=1)
       
if __name__ == '__main__':
    start = time.time()
    df = get_screener('111')
    print(f'That tooks {(time.time()-start)/60} minuites to get all of tickers')
    df.to_csv('symbol.csv', index=None)