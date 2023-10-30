import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Askus } from '../../api/askus/Askus.js';

Meteor.methods({
  generateAndStoreEmbeddings: function () {
    const articles = Askus.collection.find({}, { limit: 10 }).fetch();
    const openaiAPIKey = process.env.OPENAI_API_KEY; // Remember to secure this or use environment variables

    articles.forEach(article => {
      try {
        const response = HTTP.post('https://api.openai.com/v1/embeddings', {
          headers: {
            Authorization: `Bearer ${openaiAPIKey}`,
            'Content-Type': 'application/json',
          },
          data: {
            model: 'text-embedding-ada-002',
            input: article.article_text,
          },
        });

        // Check if the response is as expected
        if (!response.data || !response.data.data || !response.data.data[0] || !response.data.data[0].embedding) {
          console.log('Unexpected response format from OpenAI for article:', article._id);
          return; // Skip to next iteration
        }

        const embedding = response.data.data[0].embedding;

        Askus.collection.update(article._id, {
          $set: {
            embedding: embedding,
          },
        });

      } catch (error) {
        console.log('Error generating embedding for article:', article._id, error);
      }
    });
  },
});
