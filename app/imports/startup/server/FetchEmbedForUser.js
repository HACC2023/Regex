import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';
import { check, Match } from 'meteor/check';
import { AskUs } from '../../api/askus/AskUs.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Constants
const MAX_SIMILAR_ARTICLES = 3;
const MAX_TOKENS_PER_ARTICLE = 2000; // Adjusted from new code
const MAX_SESSION = 3; // New constant for session length
const MAX_TOKENS_PER_MESSAGE = 400; // New constant for tokens per message

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

const computeCosineSimilarity = (embedding1, embedding2) => {
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
    throw new Error('Both embeddings must be arrays.');
  }

  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length.');
  }

  const dotProduct = embedding1.reduce((sum, value, i) => sum + value * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, value) => sum + value * value, 0));

  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    throw new Error('One of the embeddings is a zero vector, cannot compute cosine similarity.');
  }

  return dotProduct / (magnitude1 * magnitude2);
};

// Function to get embedding from OpenAI
const getEmbeddingFromOpenAI = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    if (response && response.data) {
      return response.data[0].embedding;
    }
    // Throw an error if the response format is not as expected
    throw new Error('Unexpected OpenAI API response format');
  } catch (error) {
    // Log the error and throw it to be handled by the caller
    console.error('Error in getEmbeddingFromOpenAI:', error);
    throw error;
  }
};

// Function to find the most similar articles based on user's embedding
const findMostSimilarArticles = (userEmbedding) => {
  // Ensure that MongoDB uses indexes for this query to improve performance
  const articles = AskUs.collection.find({}).fetch(); // This line would benefit from indexing

  // Compute the similarity of each article to the user embedding
  return articles
    .map(article => ({
      article,
      similarity: computeCosineSimilarity(userEmbedding, article.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, MAX_SIMILAR_ARTICLES);
};

/**
 * Gets the relevant context from the database based on the user's embedding.
 * This function finds articles similar to the user's query, truncates them to a specified length,
 * and prepares the context for the chatbot and the articles for the component.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object} An object containing two properties:
 * - messagesForChatbot: An array of objects with 'role' and 'content' representing system messages.
 * - articlesForComponent: An array of articles, each containing 'filename', 'question', and 'article_text'.
 */
// Remove the throwError function and throw errors directly

// Function to get relevant context from the database
// Function to get relevant context from the database
const getRelevantContextFromDB = (userEmbedding) => {
  // Find the most similar articles and get a truncated version for the chatbot
  const similarArticlesWithSimilarity = findMostSimilarArticles(userEmbedding);

  const messagesForChatbot = similarArticlesWithSimilarity.map(({ article }) => {
    const tokens = article.article_text.split(' '); // Tokenization by spaces
    const truncatedText = tokens.slice(0, MAX_TOKENS_PER_ARTICLE).join(' ');
    return {
      role: 'system',
      content: `From ${article.filename}: ${truncatedText}`,
    };
  });

  // Include article_text for the articlesForComponent array, as it's required by the SimilarArticles component
  const articlesForComponent = similarArticlesWithSimilarity.map(({ article }) => ({
    _id: article._id,
    filename: article.filename,
    question: article.question,
    article_text: article.article_text, // Include the full article text
    freq: article.freq,
  }));

  return {
    messagesForChatbot,
    articlesForComponent,
  };
};

/**
 * Creates a completion using OpenAI based on the provided messages.
 * @param {Object[]} messages - An array of message objects to provide context.
 * @returns {Promise<string>} The response content from the chatbot.
 * @throws {Meteor.Error} Throws an error if the OpenAI API call fails or the response format is unexpected.
 */
const createOpenAICompletion = async (messages) => {
  try {
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
/**
 * Calculates the average embedding of the messages in a session.
 * @param {Object[]} messages - An array of message objects.
 * @returns {number[] | null} The average embedding or null if no valid embeddings are present.
 */
const getAverageEmbedding = (messages) => {
  const embeddings = messages.map(msg => msg.embedding).filter(Boolean);

  // If no valid embeddings are present, return null.
  if (embeddings.length === 0) {
    console.warn('No valid embeddings provided to calculate the average.');
    return null;
  }

  // Calculate the sum of each dimension of the embeddings.
  const sumEmbedding = embeddings.reduce(
    (acc, embedding) => acc.map((value, index) => value + embedding[index]),
    new Array(embeddings[0].length).fill(0),
  );

  // Calculate the average of each dimension of the embeddings.
  return sumEmbedding.map(value => value / embeddings.length);
};

// Define a global or persistent object to store session data
// Improved session management with session cleanup
const userSessions = {};
const sessionTimeouts = {}; // Keep track of session timeouts

const cleanupSession = (userId) => {
  delete userSessions[userId];
  delete sessionTimeouts[userId];
};
const TOPIC_SHIFT_THRESHOLD = 0.7;

const getInitialContext = () => ([
  { role: 'system', content: 'You are a helpful chatbot that can answer questions based on the following articles provided.' },
  { role: 'system', content: 'You can engage in friendly conversation, but your main purpose is to provide information from our knowledge base.' },
  { role: 'assistant', content: 'Hello! How can I assist you today?' },
]);

const greetings = ['hello', 'hi', 'how do you do', 'good day'];

Meteor.methods({
  async getChatbotResponse(receivedUserId, userMessage) {
    check(receivedUserId, Match.Maybe(String));

    if (typeof userMessage !== 'string') {
      return throwError('validation-error', `Expected userMessage to be a string but got ${typeof userMessage}`);
    }
    check(userMessage, String); // Check that userMessage is a string

    try {
      const userId = receivedUserId || 'defaultUserId';
      console.log('userId:', userId);
      console.log('userMessage:', userMessage);

      // Session cleanup logic
      clearTimeout(sessionTimeouts[userId]); // Clear any existing timeout
      sessionTimeouts[userId] = setTimeout(() => cleanupSession(userId), 1000 * 60 * 30); // Cleanup after 30 minutes of inactivity

      const userSession = userSessions[userId] ?? {
        messages: [],
        currentTopicEmbedding: null,
        currentArticles: null,
      };

      const userEmbedding = await getEmbeddingFromOpenAI(userMessage).catch((error) => {
        console.error('Error when getting embedding:', error);
        return null; // Return null if there's an error
      });

      if (userEmbedding) {
        userSession.messages.push({ role: 'user', content: userMessage, embedding: userEmbedding });
      } else {
        // Decide how to handle cases where the embedding is not available
        // For example, you could skip adding this message to the session or add it with a null embedding
      }

      if (userSession.messages.length > MAX_SESSION) {
        userSession.messages = userSession.messages.slice(-MAX_SESSION);
      }

      let chatbotResponse;
      let similarArticles;

      // Check for greetings and respond accordingly
      if (greetings.includes(userMessage.toLowerCase())) {
        chatbotResponse = 'Hello! How can I assist you today?';
        similarArticles = [];
        userSession.currentTopicEmbedding = null;
      } else {
        // If not a greeting, handle the user message
        const previousTopicEmbedding = userSession.currentTopicEmbedding;
        const similarity = previousTopicEmbedding ? computeCosineSimilarity(userEmbedding, previousTopicEmbedding) : 1;

        // Avoid recomputation of embeddings
        if (!userSession.currentTopicEmbedding || similarity < TOPIC_SHIFT_THRESHOLD) {
          // Only update context if the topic has shifted significantly
          const context = getRelevantContextFromDB(userEmbedding);
          userSession.currentArticles = context.articlesForComponent;
          userSession.currentTopicEmbedding = getAverageEmbedding(context.messagesForChatbot);
        }

        // Check if the currentTopicEmbedding is null before using it
        if (userSession.currentTopicEmbedding === null) {
          // Handle the case where there is no valid average embedding
          // For example, you might skip certain operations or use a default value
        }

        const initialContext = getInitialContext();
        const messages = [
          ...initialContext,
          ...userSession.messages,
          ...(userSession.currentArticles || []).map(article => ({
            role: 'system',
            _id: article._id,
            freq: article.freq,
            content: `From ${article.filename}: ${article.article_text}`,
          })),
          { role: 'user', content: userMessage },
        ];

        chatbotResponse = await createOpenAICompletion(messages);
        similarArticles = userSession.currentArticles;
      }

      userSession.messages.push({ role: 'assistant', content: chatbotResponse });
      userSessions[userId] = userSession;

      // Return the response and any similar articles found
      return { chatbotResponse, similarArticles };
    } catch (error) {
      // If an error occurs, log it and throw a Meteor error
      console.error('Error in getChatbotResponse:', error);
      throw new Meteor.Error('getChatbotResponse-failure', 'An error occurred while getting the chatbot response.');
    }
  },
});
