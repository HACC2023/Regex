import os
import csv
from bs4 import BeautifulSoup

def clean_text(text):
    """
    Clean the provided text by:
    1. Replacing non-breaking spaces with regular spaces.
    2. Removing excessive white spaces.
    3. Other cleaning operations can be added here as required.

    Args:
    - text (str): The text to be cleaned.

    Returns:
    - str: Cleaned text.
    """
    cleaned_text = text.replace("\xa0", " ")  # Replace NBSP with regular space
    cleaned_text = ' '.join(cleaned_text.split())  # Remove excessive white spaces
    return cleaned_text

def extract_content_from_html(html_content):
    """
    Extract and clean content from given HTML based on specific identifiers.

    Args:
    - html_content (str): The HTML content to parse.

    Returns:
    - tuple: A tuple containing the cleaned extracted question and answer, or None for incomplete parses.
    """
    soup = BeautifulSoup(html_content, "html.parser")

    kb_article_question = soup.find(id="kb_article_question")
    kb_article_text = soup.find(id="kb_article_text")

    kb_question_text = kb_article_question.get_text(strip=True) if kb_article_question else None
    kb_answer_text = kb_article_text.get_text(strip=True) if kb_article_text else None

    # Cleaning the extracted content
    kb_question_text = clean_text(kb_question_text) if kb_question_text else None
    kb_answer_text = clean_text(kb_answer_text) if kb_answer_text else None

    # Return None if either the question or answer is missing
    if not kb_question_text or not kb_answer_text:
        return None, None

    return kb_question_text, kb_answer_text

def main():
    """
    Main function to extract training data and identify incomplete parses.
    """
    directory_path = "article_html"  # Path to the directory containing the HTML files
    training_data = []
    incomplete_parses = []

    # Iterate through each file in the directory
    for filename in os.listdir(directory_path):
        if filename.endswith(".html"):
            filepath = os.path.join(directory_path, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as file:
                    content = file.read()
                question, answer = extract_content_from_html(content)

                # If content is identified as incomplete, add to the incomplete list
                if not question or not answer:
                    incomplete_parses.append(filename)
                else:
                    training_data.append((question, answer))
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")

    # Save the training data to a CSV file
    with open('training_data.csv', 'w', newline='', encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Question", "Answer"])  # Header row
        writer.writerows(training_data)

    # Save the filenames of incomplete parses to a text file
    with open('incomplete_parse.txt', 'w', encoding="utf-8") as file:
        for incomplete_file in incomplete_parses:
            file.write(f"{incomplete_file}\n")

if __name__ == "__main__":
    main()
