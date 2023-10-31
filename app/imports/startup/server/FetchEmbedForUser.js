import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';
import { Askus } from '../../api/askus/Askus.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

async function getEmbeddingFromOpenAI(text) {
  try {
    console.log(openai.embeddings);

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    if (response && response.data) {
      return response.data[0].embedding;
    }
    throw new Error('Unexpected OpenAI API response format');

  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw new Meteor.Error('embedding-error', error.message || 'Failed to fetch embedding from OpenAI');
  }
}

function findMostSimilarArticles(userEmbedding) {
  const articles = Askus.collection.find({}).fetch();

  return articles
    .filter((article) => Array.isArray(article.embedding))
    .map((article) => {
      const similarity = computeCosineSimilarity(userEmbedding, article.embedding);
      return {
        ...article,
        similarity,
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
}

function getRelevantContextFromDB(userEmbedding) {
  console.log('User Embedding:', userEmbedding);
  const similarArticles = findMostSimilarArticles(userEmbedding);
  console.log('Similar articles found:', similarArticles);


  return similarArticles.map((article) => ({
    role: 'system',
    content: `From ${article.filename}: ${article.article_text}`,
  }));
}

Meteor.methods({
  async getChatbotResponse(userMessage) {
    const userEmbedding = await getEmbeddingFromOpenAI(userMessage);
    const chatbotContext = getRelevantContextFromDB(userEmbedding);

    const initialContext = [
      { role: 'system', content: 'You are a chatbot that can only answer questions based on the following IT articles provided and nothing else.' },
      { role: 'system', content: 'I can only answer IT-related problems based on our embedded knowledge base.' },
    ];

    const messages = [
      ...initialContext,
      ...chatbotContext,
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.2,
        max_tokens: 150,
      });

      if (response && response.choices && response.choices[0]) {
        const answer = response.choices[0].message.content;

        // Post-process: Check if the answer is IT related (this is a simplistic check)
        const IT_KEYWORDS = ['server', 'network', 'computer', 'software', 'hardware'];
        if (IT_KEYWORDS.some(keyword => answer.toLowerCase().includes(keyword))) {
          return answer;
        }
        return 'Sorry, I can only provide information related to IT based on our embedded knowledge.';

      }
      throw new Error('Unexpected OpenAI API response format');

    } catch (error) {
      console.error('Error during OpenAI API call:', error);
      throw new Meteor.Error('api-error', 'Failed to get a response from the chatbot');
    }
  },
});
