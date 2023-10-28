# AI Chatbot with MongoDB Integration and Web Interface

This project integrates a generative AI model with a MongoDB database to fetch relevant articles through a web interface. It involves parsing HTML articles, storing parsed data in MongoDB, developing a conversational UX powered by AI, and presenting results in a user-friendly web interface.

## Table of Contents
- [Parsing HTML Articles](#parsing-html-articles)
- [Storing Data in MongoDB](#storing-data-in-mongodb)
- [AI Chatbot Development](#ai-chatbot-development)
- [Web Interface Development](#web-interface-development)
- [Image References Handling](#image-references-handling)
- [Metrics and Success Tracking](#metrics-and-success-tracking)

## Parsing HTML Articles
1. Extract content from the provided HTML articles.
    - Extract the question using the `id="kb_article_question"`.
    - Extract the article text using the `id="kb_article_text"`.
    - Identify and note image sources for later handling.

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

# AI Chatbot with MongoDB Integration and Web Interface

This project aims to integrate a generative AI model with a MongoDB database to fetch relevant articles through a web interface. It also ensures proper display and accessibility of images referenced in the articles.

## Table of Contents
- [AI Chatbot Development](#ai-chatbot-development)
- [Web Interface Development](#web-interface-development)
- [Image References Handling](#image-references-handling)
- [Metrics and Success Tracking](#metrics-and-success-tracking)

## AI Chatbot Development
- Utilize a Generative AI model such as GPT or a similar alternative.
- Train or integrate the AI chatbot to understand natural language queries.
- Connect the chatbot to search the MongoDB database for matching articles.

## Web Interface Development
- Use the Meteor framework with React for the web interface.
- Style the interface using Bootstrap 5 to ensure a responsive design.
- Implement a chatbox where users can input their questions.
- Display results fetched from the MongoDB database when relevant matches are found.
- Ensure proper rendering of images from the articles.

## Image References Handling
- If the images are hosted on the main page (https://www.hawaii.edu/), prepend this URL to the `src` attribute of each image.
- For images not hosted on the main page, consider moving them to your server and updating their `src` paths accordingly to ensure accessibility.

## Metrics and Success Tracking
- Integrate a system to monitor and track metrics:
    - Monitor successful searches.
    - Track reductions in Help Desk ticket submissions.
- Utilize the metrics to evaluate the effectiveness and success of the implemented solution.

---

**Note:** Always make sure to follow best practices for development, testing, and deployment to ensure the robustness and reliability of the solution.
