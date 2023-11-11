import os
import logging
import re
from bs4 import BeautifulSoup, Comment

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def clean_content(content):
    # Replace NBSP with space
    content = content.replace(u'\xa0', u' ')

    # Normalize newlines - replace multiple newlines with two newlines
    # Adjust the number in {2,} to control how many consecutive newlines to allow
    content = re.sub(r'\n{2,}', '\n\n', content)

    return content

def extract_and_save_content(file_path, output_folder):
    logging.info(f"Processing file: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

        # Find content between specific comments
        begin_comment = soup.find(string=lambda text: isinstance(text, Comment) and 'BEGIN::Content Menu' in text)
        end_comment = soup.find(string=lambda text: isinstance(text, Comment) and 'END::Content' in text)

        if begin_comment and end_comment:
            content = ''.join(str(s) for s in begin_comment.find_all_next(string=True) if s is not end_comment)

            # Clean the content
            cleaned_content = clean_content(content)

            # Extract the title
            title = soup.title.string if soup.title else 'No Title'

            # Save to new file
            output_file_path = os.path.join(output_folder, os.path.splitext(os.path.basename(file_path))[0] + '.txt')
            with open(output_file_path, 'w', encoding='utf-8') as output_file:
                output_file.write(f"Title: {title}\n\n")
                output_file.write(cleaned_content)

            logging.info(f"Successfully processed and saved {os.path.basename(file_path)}")
        else:
            logging.warning(f"Content markers not found in {file_path}")

def parse_folder(folder_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(folder_path):
        if filename.endswith('.html'):
            file_path = os.path.join(folder_path, filename)
            extract_and_save_content(file_path, output_folder)
        else:
            logging.info(f"Skipping non-HTML file: {filename}")

folder_path = 'challenge_1'  # Replace with the path to your folder
output_folder = 'parse_challenge1'  # Replace with the path to the output folder
parse_folder(folder_path, output_folder)
