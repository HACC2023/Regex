import os
from bs4 import BeautifulSoup

# Directory where the downloaded HTML files are saved
download_directory = 'challenge_3'  # Replace with the path to your directory if different

# Function to extract content from a file
def extract_content(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            soup = BeautifulSoup(file, 'html.parser')
            content = soup.find('div', {'id': 'content', 'role': 'main'})
            if content:
                return content.get_text(strip=True)
            else:
                return "Content not found"
    except FileNotFoundError:
        return "File not found"

# Iterate over each downloaded file and extract content
for file in os.listdir(download_directory):
    if file.endswith('.html'):
        content = extract_content(os.path.join(download_directory, file))
        print(f"Content from {file}:\n{content}\n{'-'*40}")
