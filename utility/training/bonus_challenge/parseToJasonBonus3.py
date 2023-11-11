import os
import json
from bs4 import BeautifulSoup

# Directory where the downloaded HTML files are saved
download_directory = 'challenge_3'  # Adjust as needed

# Function to extract content from a file
def extract_content(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            soup = BeautifulSoup(file, 'html.parser')
            content = soup.find('div', {'id': 'content', 'role': 'main'})
            if content:
                return content.get_text(strip=True)
            else:
                return None
    except FileNotFoundError:
        return None

# List to store extracted content
extracted_data = []
# List to store filenames of content not found or file not found
not_found_files = []

# Iterate over each downloaded file and extract content
for file in os.listdir(download_directory):
    if file.endswith('.html'):
        file_path = os.path.join(download_directory, file)
        content = extract_content(file_path)
        if content:
            question = os.path.splitext(file)[0]
            extracted_data.append({
                "filename": file,
                "question": question,
                "article_text": content
            })
        else:
            not_found_files.append(file)

# Save extracted data to a JSON file
with open('challenge_three.json', 'w', encoding='utf-8') as json_file:
    json.dump(extracted_data, json_file, indent=4, ensure_ascii=False)

# Save not found files to a text file
with open('fileNotFound.txt', 'w', encoding='utf-8') as txt_file:
    for file in not_found_files:
        txt_file.write(file + '\n')
