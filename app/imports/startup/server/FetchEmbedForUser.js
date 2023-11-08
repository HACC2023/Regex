import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';
import { check } from 'meteor/check';
import { AskUs } from '../../api/askus/AskUs.js'; // Make sure to use the correct collection name

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Constants
const MAX_ARTICLES = 3;
const MAX_SIMILAR_ARTICLES = 3;
const MAX_TOKENS_PER_ARTICLE = 800; // Use the larger value from the new code
const MAX_SESSION = 2;
const MAX_TOKENS_PER_MESSAGE = 400;

/**
 * Throws a formatted Meteor error and logs the message.
 * @param {string} type - The error type.
 * @param {string} message - The error message.
 * @throws {Meteor.Error} Throws a Meteor.Error with the specified type and message.
 */
const throwError = (type, message) => {
  console.error(message);
  throw new Meteor.Error(type, message);
};

/**
 * Computes the cosine similarity between two vectors.
 * @param {number[]} embedding1 - The first vector.
 * @param {number[]} embedding2 - The second vector.
 * @returns {number} The cosine similarity.
 * @throws {Error} Throws an error if the inputs are not arrays or if their lengths do not match.
 */
function computeCosineSimilarity(embedding1, embedding2) {
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
    throw new Error('Both embeddings must be arrays.');
  }

  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length.');
  }

  const dotProduct = embedding1.reduce((sum, value, i) => sum + value * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, value) => sum + value * value, 0));

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Fetches the embedding from OpenAI for a given text.
 * @param {string} text - The text to get the embedding for.
 * @returns {Promise<number[]>} The embedding vector.
 * @throws {Meteor.Error} Throws an error if the OpenAI API call fails or the response format is unexpected.
 */
const getEmbeddingFromOpenAI = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    if (response && response.data) {
      return response.data[0].embedding;
    }
    return throwError('embedding-error', 'Unexpected OpenAI API response format');

  } catch (error) {
    return throwError('embedding-error', `Failed to fetch embedding from OpenAI: ${error.message}`);
  }
};

/**
 * Finds the most similar articles to the user's embedding.
 * This function calculates the cosine similarity between the user's embedding and the embedding of each article,
 * sorts the articles by similarity, and returns the top articles.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object[]} An array of the most similar articles.
 */
function findMostSimilarArticles(userEmbedding) {
  const articles = AskUs.collection.find({}).fetch();

  const similarities = articles.map(article => ({
    article: article,
    similarity: computeCosineSimilarity(userEmbedding, article.embedding),
  }));

  const sortedArticles = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, MAX_ARTICLES);

  return sortedArticles.map(item => item.article);
}

/**
 * Gets the relevant context from the database based on the user's embedding.
 * This function finds articles similar to the user's query, truncates them to a specified length,
 * and prepares the context for the chatbot and the articles for the component.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object} An object containing two properties:
 * - messagesForChatbot: An array of objects with 'role' and 'content' representing system messages.
 * - articlesForComponent: An array of articles, each containing 'filename', 'question', and 'article_text'.
 */
function getRelevantContextFromDB(userEmbedding) {
  console.log('User Embedding:', userEmbedding);
  const similarArticles = findMostSimilarArticles(userEmbedding).slice(0, MAX_SIMILAR_ARTICLES);

  console.log('Similar articles found:', similarArticles);

  // Truncate each article to maxTokensPerArticle tokens
  const truncatedArticles = similarArticles.map(article => {
    const tokens = article.article_text.split(' '); // naive tokenization by spaces
    const truncatedText = tokens.slice(0, MAX_TOKENS_PER_ARTICLE).join(' ');
    return {
      ...article,
      article_text: truncatedText,
    };
  });

  // Return messages for the chatbot
  const messages = truncatedArticles.map((article) => ({
    role: 'system',
    content: `From ${article.filename}: ${article.article_text}`,
  }));

  // Return articles in the expected format
  const articlesForComponent = truncatedArticles.map((article) => ({
    _id: article._id,
    filename: article.filename,
    question: article.question,
    article_text: article.article_text,
    freq: article.freq,
  }));

  return {
    messagesForChatbot: messages,
    articlesForComponent: articlesForComponent,
  };
}

/**
 * Creates a completion using OpenAI based on the provided messages.
 * @param {Object[]} messages - An array of message objects to provide context.
 * @returns {Promise<string>} The response content from the chatbot.
 * @throws {Meteor.Error} Throws an error if the OpenAI API call fails or the response format is unexpected.
 */
const createOpenAICompletion = async (messages) => {
  try {
    // Remove any properties from the messages that are not expected by the OpenAI API
    const filteredMessages = messages.map(({ role, content }) => ({ role, content }));

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: filteredMessages,
      temperature: 0.2,
      max_tokens: MAX_TOKENS_PER_MESSAGE,
    });

    console.log('OpenAI API Response:', response);

    if (response && response.choices && response.choices[0]) {
      return response.choices[0].message.content;
    }
    return throwError('api-error', 'Unexpected OpenAI API response format');

  } catch (error) {
    return throwError('api-error', `Failed to get a response from the chatbot: ${error.message}`);
  }
};

/**
 * Calculates the average embedding of the messages in a session.
 * @param {Object[]} messages - An array of message objects.
 * @returns {number[]} The average embedding.
 */
function getAverageEmbedding(messages) {
  const embeddings = messages.map(msg => msg.embedding).filter(embedding => embedding);
  if (embeddings.length === 0) {
    console.error('No embeddings provided to calculate the average.');
    // Handle the case where no embeddings are available (e.g., by returning a default embedding or null)
    return null; // Example fallback
  }

  const sumEmbedding = embeddings.reduce((acc, embedding) => acc.map((value, index) => value + embedding[index]), new Array(embeddings[0].length).fill(0));

  return sumEmbedding.map(value => value / embeddings.length);
}

/** Meteor method to get the chatbot's response for a given user message.
 * This method fetches the user's embedding, retrieves relevant context from the database,
 * prepares messages for the OpenAI chatbot, and fetches a completion response.
 * @param {string} userMessage - The user's message/query.
 * @returns {Promise<Object>} An object containing the chatbot's response and similar articles.
 *
 */
// Define a global or persistent object to store session data
const userSessions = {};

Meteor.methods({
  async getChatbotResponse(userId, userMessage) {
    check(userId, String);
    check(userMessage, String);

    // Retrieve or initialize the user's session
    const userSession = userSessions[userId] || {
      messages: [],
      currentTopicEmbedding: null, // Embedding representing the current topic
      currentArticles: null, // Field to store the current articles
    };

    // Fetch and store the embedding for the user's message
    const userEmbedding = await getEmbeddingFromOpenAI(userMessage);
    console.log('Fetched user embedding:', userEmbedding); // Log to confirm embedding is fetched
    userSession.messages.push({ role: 'user', content: userMessage, embedding: userEmbedding });

    // Ensure the session does not exceed the maximum length
    if (userSession.messages.length > MAX_SESSION) {
      userSession.messages = userSession.messages.slice(-MAX_SESSION);
    }

    const greetings = ['hello', 'hi', 'how do you do', 'good day'];
    let chatbotResponse;
    let similarArticles;

    if (greetings.includes(userMessage.toLowerCase())) {
      chatbotResponse = 'Hello! How can I assist you today?';
      similarArticles = [];
      userSession.currentTopicEmbedding = null; // Reset the topic when greeting
    } else {
      // Check if the user's message is similar to the previous topic
      const previousTopicEmbedding = userSession.currentTopicEmbedding;
      let similarity = 1; // Default to 1 (max similarity) if no previous topic

      if (previousTopicEmbedding) {
        similarity = computeCosineSimilarity(userEmbedding, previousTopicEmbedding);
      }

      const TOPIC_SHIFT_THRESHOLD = 0.7; // Define a threshold for topic shift detection
      if (similarity < TOPIC_SHIFT_THRESHOLD || !userSession.currentTopicEmbedding) {
        // Topic has shifted significantly, or no topic yet determined
        const { messagesForChatbot, articlesForComponent } = getRelevantContextFromDB(userEmbedding);
        userSession.currentArticles = articlesForComponent;

        // Check if messagesForChatbot have embeddings before calculating the average
        if (messagesForChatbot.some(msg => msg.embedding)) {
          userSession.currentTopicEmbedding = getAverageEmbedding(messagesForChatbot);
        } else {
          console.error('No embeddings found in messages for chatbot. Cannot calculate average embedding.');
          // Handle the case where no embeddings are available (e.g., by setting a default embedding or throwing an error)
        }
      }

      const initialContext = [
        { role: 'system', content: 'You are a helpful chatbot that can answer questions based on the following articles provided.' },
        { role: 'system', content: 'You can engage in friendly conversation, but your main purpose is to provide information from our knowledge base.' },
        { role: 'assistant', content: 'Hello! How can I assist you today?' },
      ];

      console.log('Session History:', userSession.messages);

      const messages = [
        ...initialContext,
        ...userSession.messages,
        ...(userSession.currentArticles ? userSession.currentArticles.map(article => ({
          role: 'system',
          _id: article._id,
          freq: article.freq,
          content: `From ${article.filename}: ${article.article_text}` })) : []),
        { role: 'user', content: userMessage },
      ];

      chatbotResponse = await createOpenAICompletion(messages);
      similarArticles = userSession.currentArticles;
    }

    userSession.messages.push({ role: 'assistant', content: chatbotResponse });
    userSessions[userId] = userSession; // Update the session

    return {
      chatbotResponse,
      similarArticles,
    };
  },
});
