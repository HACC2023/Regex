import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Askus } from '../../api/askus/Askus.js';

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

function getEmbeddingFromOpenAI(text) {
  const openaiAPIKey = process.env.OPENAI_API_KEY; // Remember to secure this or use environment variables

  try {
    const response = HTTP.post('https://api.openai.com/v1/embeddings', {
      headers: {
        Authorization: `Bearer ${openaiAPIKey}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'text-embedding-ada-002',
        input: text,
      },
    });

    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Detailed OpenAI API Error:', error.response ? error.response.content : error);
    throw new Meteor.Error('embedding-error', 'Failed to fetch embedding from OpenAI');
  }
}

function findMostSimilarArticles(userEmbedding) {
  const articles = Askus.collection.find({}).fetch();

  const similarArticles = articles
    .filter(article => Array.isArray(article.embedding)) // Filter out articles without valid embeddings
    .map(article => {
      console.log('User Embedding:', userEmbedding); // For debugging
      console.log('Article Embedding:', article.embedding); // For debugging

      const similarity = computeCosineSimilarity(userEmbedding, article.embedding);
      return {
        ...article,
        similarity,
      };
    });

  return similarArticles.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
}

Meteor.methods({
  'askus.getAnswer': function (userQuestion) {
    const questionEmbedding = getEmbeddingFromOpenAI(userQuestion);
    const similarArticles = findMostSimilarArticles(questionEmbedding);

    if (similarArticles.length > 0) {
      return similarArticles[0].article_text;
    }
    return "Sorry, I couldn't find a relevant answer to your question.";
  },
});
