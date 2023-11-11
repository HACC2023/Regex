import os
import logging
import re
import json
import pdfplumber
from bs4 import BeautifulSoup, Comment

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def clean_content(content):
    # Replace NBSP with space
    content = content.replace(u'\xa0', u' ')
    # Normalize newlines - replace multiple newlines with two newlines
    content = re.sub(r'\n{2,}', '\n\n', content)
    return content

def extract_article_content(soup):
    articles_content = []
    articles = soup.find_all('article')
    for article in articles:
        content = article.get_text(separator='\n', strip=True)
        cleaned_content = clean_content(content)
        articles_content.append(cleaned_content)
    return ' '.join(articles_content)  # Join all articles into a single string

def parse_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        # Extract content from the entire file or specific sections
        extracted_content = extract_article_content(soup)
        return extracted_content

def parse_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + '\n'
        return clean_content(text)

def parse_folder(folder_path):
    parsed_data = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        file_content = None

        if filename.lower().endswith('.html'):
            file_content = parse_html(file_path)
        elif filename.lower().endswith('.pdf'):
            file_content = parse_pdf(file_path)

        if file_content:
            parsed_data.append({
                "filename": filename,
                "question": os.path.splitext(filename)[0],
                "article_text": file_content
            })

    return parsed_data

folder_path = 'challenge_1'  # Replace with the path to your folder
parsed_data = parse_folder(folder_path)

# Write the parsed data to a JSON file
output_file = 'challenge_one.json'
with open(output_file, 'w', encoding='utf-8') as file:
    json.dump(parsed_data, file, indent=4)

logging.info(f"Parsed data saved to {output_file}")
