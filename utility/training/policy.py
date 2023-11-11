import requests
from bs4 import BeautifulSoup
import os

def download_file(url, folder="downloaded_files"):
    """
    Download file from the given URL and save it to the specified folder.
    """
    if not os.path.exists(folder):
        os.makedirs(folder)

    response = requests.get(url)
    filename = url.split('/')[-1]
    filepath = os.path.join(folder, filename)

    with open(filepath, 'wb') as file:
        file.write(response.content)

    return filepath

def download_pdf(link):
    """
    Download a PDF file from the given link.
    """
    print(f"Downloading PDF from {link}")
    download_file(link)

def fetch_html(link):
    """
    Fetch and return the HTML content from the given link.
    """
    print(f"Fetching HTML content from {link}")
    response = requests.get(link)
    return response.text

def save_html(html_content, policy_name):
    """
    Save the HTML content to a file named after the policy.
    """
    filename = f"{policy_name}.html".replace("/", "-").replace(" ", "_")
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(html_content)
    print(f"Saved HTML content to {filename}")

def parse_html(file_path):
    """
    Parse the HTML file and extract policy information and links.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    policies = []
    for row in soup.find_all('tr'):
        cols = row.find_all('td')
        if len(cols) >= 3:
            policy_info = {
                "name": cols[0].text.strip(),
                "title": cols[1].text.strip(),
                "application": cols[2].text.strip(),
                "link": cols[0].find('a', href=True)['href'] if cols[0].find('a', href=True) else None
            }
            policies.append(policy_info)
    return policies

def process_link(link, policy_name):
    """
    Process the link based on its type (PDF or HTML).
    """
    if link and ('.pdf' in link or '[PDF]' in policy_name):
        download_pdf(link)
    elif link:
        html_content = fetch_html(link)
        save_html(html_content, policy_name)

# Replace 'policy.html' with the path to your HTML file
file_path = 'policy.html'
policies = parse_html(file_path)

for policy in policies:
    print(f"Name: {policy['name']}, Title: {policy['title']}, Application: {policy['application']}, Link: {policy['link']}")
    process_link(policy['link'], policy['name'])
