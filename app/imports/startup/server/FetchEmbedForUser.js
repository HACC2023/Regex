import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';
import { Askus } from '../../api/askus/Askus.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_ARTICLES = 5;
const MAX_SIMILAR_ARTICLES = 3;
const MAX_TOKENS_PER_ARTICLE = 600;

const throwError = (type, message) => {
  console.error(message);
  throw new Meteor.Error(type, message);
};

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

function findMostSimilarArticles(userEmbedding) {
  const articles = Askus.collection.find({}).fetch();

  const similarities = articles.map(article => ({
    article: article,
    similarity: computeCosineSimilarity(userEmbedding, article.embedding),
  }));

  const sortedArticles = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, MAX_ARTICLES);

  return sortedArticles.map(item => item.article);
}

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
    filename: article.filename,
    question: article.question,
    article_text: article.article_text,
  }));

  return {
    messagesForChatbot: messages,
    articlesForComponent: articlesForComponent,
  };
}
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

Meteor.methods({
  async getChatbotResponse(userMessage) {
    const userEmbedding = await getEmbeddingFromOpenAI(userMessage);
    const { messagesForChatbot, articlesForComponent } = getRelevantContextFromDB(userEmbedding);

    const initialContext = [
      { role: 'system', content: 'You are a chatbot that can only answer questions based on the following IT articles provided and nothing else.' },
      { role: 'system', content: 'I can only answer IT-related problems based on our embedded knowledge base.' },
    ];

    const messages = [
      ...initialContext,
      ...messagesForChatbot,
      { role: 'user', content: `Can you answer the question: ${userMessage} based on the given IT articles?` },
    ];

    const chatbotResponse = await createOpenAICompletion(messages);

    return {
      chatbotResponse,
      similarArticles: articlesForComponent,
    };
  },
});
