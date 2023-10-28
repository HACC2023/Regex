import os
import json
from bs4 import BeautifulSoup

def simple_clean_text(text):
    """
    Simplified text cleaning:
    1. Replace non-breaking spaces with regular spaces.
    2. Remove excessive newlines.
    """
    cleaned_text = text.replace("\xa0", " ")
    cleaned_text = ' '.join(cleaned_text.split())
    return cleaned_text

def parse_html_simple_clean_text(file_path):
    """
    Parse an HTML file to extract and clean the question and article text using the simplified cleaning function.

    Parameters:
    - file_path (str): The path to the HTML file to be parsed.

    Returns:
    - dict: A dictionary containing the cleaned question and article text.
    """
    # Initialize the default return values
    question, article_text = None, None

    with open(file_path, "r", encoding="utf-8") as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, 'lxml')

    # Safely extract and clean the question using the id="kb_article_question"
    if soup.find(id="kb_article_question"):
        question = simple_clean_text(soup.find(id="kb_article_question").text.strip())

    # Safely extract and clean the article text using the id="kb_article_text"
    if soup.find(id="kb_article_text"):
        article_text = simple_clean_text(soup.find(id="kb_article_text").text.strip())

    return {
        "question": question,
        "article_text": article_text
    }

# Directory containing the HTML files
html_dir = "article_html"

# Create a directory to save JSON files if it doesn't exist
json_output_dir = "parsed_json"
if not os.path.exists(json_output_dir):
    os.makedirs(json_output_dir)

# List to store filenames of articles with null values
null_articles = []

# Iterate through each file in the directory
for filename in os.listdir(html_dir):
    # Ensure we're only parsing .html files
    if filename.endswith(".html"):
        file_path = os.path.join(html_dir, filename)
        parsed_data = parse_html_simple_clean_text(file_path)

        if parsed_data["question"] is None and parsed_data["article_text"] is None:
            null_articles.append(filename)
        else:
            # Save the parsed data as a JSON file
            json_filename = os.path.join(json_output_dir, f"{os.path.splitext(filename)[0]}.json")
            with open(json_filename, "w", encoding="utf-8") as json_file:
                json.dump(parsed_data, json_file, ensure_ascii=False, indent=4)

            print(f"Saved cleaned data for {filename} to {json_filename}")

# Save the list of articles with null values to a file
with open("null_articles.txt", "w", encoding="utf-8") as null_file:
    for article in null_articles:
        null_file.write(f"{article}\n")

print(f"\nSaved list of articles with null values to null_articles.txt")
