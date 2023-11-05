import { Meteor } from 'meteor/meteor';
import OpenAIApi from 'openai';
import { Askus } from '../../api/askus/Askus.js';

const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
const MAX_TOKENS = 8192; // Max tokens allowed by the model

Meteor.methods({
  generateAndStoreEmbeddings: async function () {
    // Fetch articles from the Askus collection that do not have an embedding yet.
    const articles = Askus.collection.find({ embedding: { $exists: false } }).fetch();

    // Process each article in parallel and wait for all operations to complete
    await Promise.all(articles.map(async (article) => {
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
        } else {
          const embedding = response.data[0].embedding;

          Askus.collection.update(article._id, {
            $set: {
              embedding: embedding,
            },
          });
        }
      } catch (error) {
        console.log('Error generating embedding for article:', article._id, error);
      }
    }));

    console.log('All articles processed.');
  },
});
