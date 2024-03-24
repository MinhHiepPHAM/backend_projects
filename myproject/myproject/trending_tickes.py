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

def get_trending_symbols():
    t1 = time.time()
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--blink-settings=imagesEnabled=false')
    driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=options)
    driver.set_window_size(1920, 1080)

    # t2 = time.time()
    # print('options:', (t2-t1)/60)

    # Navigate to the URL
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
    
    # t3 = time.time()
    # print('get url:', (t3-t2)/60)

    # Get the HTML content after JavaScript execution
    html_content = driver.page_source

    # t4= time.time()
    # print('html content:', (t4-t3)/60)

    # Close the browser
    driver.quit()

    if html_content:
        # Parse the HTML content of the page
        soup = BeautifulSoup(html_content, 'html.parser')

        # Find all news articles
        symbol_links = soup.find_all('a', class_='Fw(b)')
        # t5 = time.time()
        # print('bs4:', (t5-t4)/60)
        return [symbol_link.text for symbol_link in symbol_links if 'data-symbol' in str(symbol_link)]


if __name__ == '__main__':
    print(get_trending_symbols())


    
