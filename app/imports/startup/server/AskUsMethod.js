import { Meteor } from 'meteor/meteor';
import OpenAIApi from 'openai';
import { AskUs } from '../../api/askus/AskUs.js';

const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
const MAX_TOKENS = 8192; // Max tokens allowed by the model
const PARALLEL_LIMIT = 5; // Number of articles to process in parallel

// Truncates text at the last full stop before the max token limit
const truncateText = (text, maxTokens) => {
  if (text.length <= maxTokens) return text;
  let end = text.lastIndexOf('.', maxTokens);
  if (end === -1) end = maxTokens;
  return text.substring(0, end + 1);
};

// Validates the OpenAI API response
const validateOpenAIResponse = (response) => {
  if (!response.data || !response.data[0] || !response.data[0].embedding) {
    throw new Error('Unexpected response format');
  }
  return response.data[0].embedding;
};

Meteor.methods({
  generateAndStoreEmbeddings: async function () {
    const articles = AskUs.collection.find({ embedding: { $exists: false } }).fetch();

    // Process articles in chunks to avoid hitting rate limits
    for (let i = 0; i < articles.length; i += PARALLEL_LIMIT) {
      const chunk = articles.slice(i, i + PARALLEL_LIMIT);
      const embeddingPromises = chunk.map(async (article) => {
        const articleText = truncateText(article.article_text, MAX_TOKENS);

        try {
          const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: articleText,
          });

          return {
            _id: article._id,
            embedding: validateOpenAIResponse(response),
          };

        } catch (error) {
          console.error('Error generating embedding for article:', article._id, error);
          return null;
        }
      });

      // Wait for all the embeddings in the current chunk
      const embeddings = await Promise.all(embeddingPromises);

      // Bulk update the database with the new embeddings
      embeddings.forEach((embeddingInfo) => {
        if (embeddingInfo) {
          AskUs.collection.update(embeddingInfo._id, {
            $set: {
              embedding: embeddingInfo.embedding,
            },
          });
        }
      });
    }
  },
});
