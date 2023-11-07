import { Meteor } from 'meteor/meteor';
import OpenAIApi from 'openai';
import { AskUs } from '../../api/askus/AskUs.js';

const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
const MAX_TOKENS = 8192; // Max tokens allowed by the model

/* eslint-disable no-console */

Meteor.methods({
  generateAndStoreEmbeddings: async function () {
    const articles = AskUs.collection.find({ embedding: { $exists: false } }).fetch();
    const updatePromises = articles.map(async (article) => {
      let articleText = article.article_text;

      // If the article text is too long, truncate it
      if (articleText.length > MAX_TOKENS) {
        console.log(`Article ${article._id} is too long with ${articleText.length} tokens. Truncating to ${MAX_TOKENS} tokens.`);
        articleText = articleText.substring(0, MAX_TOKENS);
      }

      try {
        const response = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: articleText,
        });
        // Check if the response is as expected
        if (!response.data || !response.data[0] || !response.data[0].embedding) {
          console.log('Unexpected response format from OpenAI for article:', article._id);
          return null;
        }
        const embedding = response.data[0].embedding;

        return AskUs.collection.update(article._id, {
          $set: {
            embedding: embedding,
          },
        });

      } catch (error) {
        console.log('Error generating embedding for article:', article._id, error);
        return null;
      }
    });

    // Wait for all the update operations to complete
    await Promise.all(updatePromises);
  },
});
