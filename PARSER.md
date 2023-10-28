## Setting Up the Environment

### Prerequisites
- **Python 3.x**
- **pip** (Python package manager)

### Installation

    Install the dependencies
    ```bash
        pip install beautifulsoup4 lxml
    ```

## Using the Parser

1. Organize your HTML files:
Ensure all the HTML files you want to parse are placed in a directory named article_html within the main repository directory.


2. Run the parser:
    ```bash
   python parser.py
   ```
    This script will process each HTML file, clean the text, and generate corresponding JSON files in a directory named parsed_json.
3. Check the results:
    ```bash
   ls parsed_json
   ```
    You should see a list of JSON files, each corresponding to an HTML file in the article_html directory.

   Check the generated JSON files in the parsed_json directory to see the parsed and cleaned data.
   If any articles returned null values for both the "question" and "article_text" fields, their filenames will be saved in null_articles.txt for review.

## Storing Data in MongoDB
2. After parsing, structure and store the data in MongoDB. For instance, the data can be organized as:

```json
{
  "_id": ObjectId("someid"),
  "question": "How to reset my password?",
  "text": "To reset your password, follow these steps...",
  "images": [{
    "src": "/help/chasek/images/Image/Bacula/Screen%20Shot%202023-08-11%20at%2011_40_43%20AM.png",
    "alt": "Description of image",
    "width": 502,
    "height": 387
  }]
}
```
