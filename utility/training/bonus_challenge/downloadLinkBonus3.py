import requests
from bs4 import BeautifulSoup
import os
import re

# Function to sanitize filenames
def sanitize_filename(text):
    return re.sub(r'[\\/*?:"<>|]', '', text)

# Function to download and save a webpage
def download_page(url, filename):
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(response.text)
        return True
    except requests.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return False

# Main URL
main_url = 'https://www.hawaii.edu/its/services/'

# Fetch and parse the main page
response = requests.get(main_url)
soup = BeautifulSoup(response.content, 'html.parser')

# Find the 'entry-content' div and iterate over all <a> tags within it
entry_content_div = soup.find('div', class_='entry-content')
if entry_content_div:
    for link in entry_content_div.find_all('a'):
        href = link.get('href')
        if href and href.startswith('http'):
            text = link.get_text(strip=True)
            filename = f"{sanitize_filename(text)}.html"
            if download_page(href, filename):
                print(f"Saved {href} as {filename}")
else:
    print("Entry-content div not found")
