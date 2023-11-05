import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';
import { check } from 'meteor/check';
import fs from 'fs';
import { IndexFlatL2 } from 'faiss-node';
import { Askus } from '../../api/askus/Askus.js';

/**
 * Initializes OpenAI with the API key from the environment variables.
 * https://openai.com/blog/openai-api
 * @requires OPENAI_API_KEY - An environment variable that stores the OpenAI API key.
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Constants for configuring the behavior of article retrieval and processing.
 */
const MAX_ARTICLES = 5; // Maximum number of articles to consider.
const MAX_SIMILAR_ARTICLES = 3; // Maximum number of similar articles to return.
const MAX_TOKENS_PER_ARTICLE = 600; // Maximum number of tokens per article to consider.

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
 * Finds the most similar articles to the user's embedding using FAISS.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object[]} An array of the most similar articles.
 */
function findMostSimilarArticlesFAISS(userEmbedding) {
  if (!fs.existsSync('faiss.index')) {
    console.error('FAISS index file not found.');
    return []; // Return an empty array or handle as needed
  }

  // Load the FAISS index from file
  const index = IndexFlatL2.read('faiss.index');
  const k = MAX_SIMILAR_ARTICLES; // Number of nearest neighbors
  const results = index.search(userEmbedding, k);

  // Fetch the articles with the IDs returned by FAISS
  const articleIds = results.labels;
  const articles = articleIds.map(id => Askus.collection.findOne({ _id: id }));
  return articles;
}

/**
 * Finds the most similar articles to the user's embedding.
 * This function calculates the cosine similarity between the user's embedding and the embedding of each article,
 * sorts the articles by similarity, and returns the top articles.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object[]} An array of the most similar articles.
 */
function findMostSimilarArticles(userEmbedding) {
  const articles = Askus.collection.find({}).fetch();

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

  // console.log('Similar articles found:', similarArticles);

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
    filename: article.filename,
    question: article.question,
    article_text: article.article_text,
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
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.2,
      max_tokens: 150,
    });

    if (response && response.choices && response.choices[0]) {
      return response.choices[0].message.content;
    }
    return throwError('api-error', 'Unexpected OpenAI API response format');

  } catch (error) {
    return throwError('api-error', `Failed to get a response from the chatbot: ${error.message}`);
  }
};

/**
 * Meteor method to get the chatbot's response for a given user message.
 * This method fetches the user's embedding, retrieves relevant context from the database,
 * prepares messages for the OpenAI chatbot, and fetches a completion response.
 * @param {string} userMessage - The user's message/query.
 * @returns {Promise<Object>} An object containing the chatbot's response and similar articles.
 * @example
 * // Calling the method from the client
 * Meteor.call('getChatbotResponse', 'How do I reset my password?', function(error, response) {
 *   if (error) {
 *     console.error('Error fetching chatbot response:', error);
 *   } else {
 *     console.log('Chatbot response:', response);
 *   }
 * });
 */
Meteor.methods({
  async getChatbotResponse(userMessage) {
    check(userMessage, String);
    const greetings = ['hello', 'hi', 'how do you do', 'good day'];
    let chatbotResponse;
    let similarArticles;

    if (greetings.includes(userMessage.toLowerCase())) {
      chatbotResponse = 'Hello! How can I assist you today?';
      similarArticles = [];
    } else {
      let userEmbedding;
      try {
        userEmbedding = await getEmbeddingFromOpenAI(userMessage);
      } catch (error) {
        console.error('Error fetching user embedding:', error);
        return throwError('embedding-error', `Failed to fetch embedding from OpenAI: ${error.message}`);
      }

      // Check if the FAISS index file exists
      if (fs.existsSync('faiss.index')) {
        console.log('Using FAISS for finding similar articles.');
        try {
          similarArticles = findMostSimilarArticlesFAISS(userEmbedding);
        } catch (error) {
          console.error('Error using FAISS for similarity search:', error);
          similarArticles = []; // fallback to empty array in case of error
        }
      } else {
        console.log('Using cosine similarity for finding similar articles.');
        similarArticles = findMostSimilarArticles(userEmbedding);
      }

      const { messagesForChatbot, articlesForComponent } = getRelevantContextFromDB(userEmbedding);

      const initialContext = [
        { role: 'system', content: 'You are a helpful chatbot that can answer questions based on the following articles provided.' },
        { role: 'system', content: 'You can engage in friendly conversation, but your main purpose is to provide information from our knowledge base.' },
        { role: 'assistant', content: 'Hello! How can I assist you today?' },
      ];

      const userQueryMessage = `Can you answer the question: ${userMessage} based on the given IT articles?, if i say thank you say the appropriate response`;

      const messages = [
        ...initialContext,
        ...messagesForChatbot,
        { role: 'user', content: userQueryMessage },
      ];

      try {
        chatbotResponse = await createOpenAICompletion(messages);
      } catch (error) {
        console.error('Error getting response from chatbot:', error);
        return throwError('api-error', `Failed to get a response from the chatbot: ${error.message}`);
      }
      similarArticles = articlesForComponent;
    }

    return {
      chatbotResponse,
      similarArticles,
    };
  },
});
