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
Extract content from the provided HTML articles.
- ✅ Extract the question using the `id="kb_article_question"`.
- ✅ Extract the article text using the `id="kb_article_text"`.
- ⭕ Identify and note image sources for later handling.
- ⭕ Clean the text to remove unnecessary characters and formatting.
- ✅ Ensure that the parsing script can be run on a directory of HTML articles.
  - ⭕ that returned null values for both the "question" and "article_text" fields.
  - ⭕ output the results to a directory of JSON files, and also output a list of articles that returned null values for both the "question" and "article_text" fields, and also handle image references.

## Storing Data in MongoDB
After parsing, structure and store the data in MongoDB. For instance, the data can be organized as:

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

## AI Chatbot Development
- ✅ Utilize a Generative AI model such as GPT or a similar alternative. (Core MVP feature)
- ⭕ Train or integrate the AI chatbot to understand natural language queries. (Next essential step for MVP)
- 🔲 Connect the chatbot to search the MongoDB database for matching articles. (Final MVP step)


## Web Interface Development
- ✅ Use the Meteor framework with React for the web interface. (Core MVP feature for setting up the platform)
- ⭕ Style the interface using Bootstrap 5 to ensure a responsive design. (Essential for user accessibility across devices)
- 🔲 Implement a chatbox where users can input their questions. (Direct user interaction point)
- 🔲 Display results fetched from the MongoDB database when relevant matches are found. (Central to the functionality of the chatbot)
- 🔲 Ensure proper rendering of images from the articles. (Enhances user experience by presenting complete information)
- 🔲 Incorporate user-friendly error handling. (Enhances user experience by managing expectations and guiding through errors)
- 🔲 (If applicable) Design user session management for personalized experiences. (Manages user sessions and data for personalized interactions)
- 🔲 Ensure the web interface is accessible to all users, including those with disabilities. (Ensures inclusivity and meets accessibility standards)


## Image References Handling
- If the images are hosted on the main page (https://www.hawaii.edu/), prepend this URL to the `src` attribute of each image.
- For images not hosted on the main page, consider moving them to your server and updating their `src` paths accordingly to ensure accessibility.

## Metrics and Success Tracking
- ✅ Integrate a system to monitor and track metrics. (Core MVP feature to gauge performance)
    - ⭕ Monitor successful searches. (Key metric for chatbot effectiveness)
    - 🔲 Track reductions in Help Desk ticket submissions. (Direct measure of system impact and ROI)
- 🔲 Utilize the metrics to evaluate the effectiveness and success of the implemented solution. (Allows for iterative improvements based on data-driven insights)
  User Feedback Analysis:
  🔲 Gather and analyze user feedback to identify areas of improvement.
  User Engagement Metrics:
  🔲 Track metrics like average session duration, bounce rate, and return users to understand user engagement and satisfaction.
  Error Rate:
  🔲 Monitor the rate at which the chatbot misunderstands or can't answer user queries, which can be crucial for further refinements.
  Response Time:
  🔲 Measure the average time the chatbot takes to respond to user queries, ensuring that it meets user expectations for speed.
