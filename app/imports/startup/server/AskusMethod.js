import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Askus } from '../../api/askus/Askus.js';

let lastRequestTime = Date.now();
let tokensUsedInLastMinute = 0;
const MAX_TPM = 1000000; // 1 million tokens per minute
const TOKEN_RESET_INTERVAL = 60 * 1000; // 60 seconds in milliseconds
const MAX_TOKENS = 8192; // Max tokens allowed by the model

Meteor.methods({
  generateAndStoreEmbeddings: function () {
    const articles = Askus.collection.find({ embedding: { $exists: false } }).fetch(); // Fetch only articles without embeddings
    const openaiAPIKey = process.env.OPENAI_API_KEY; // Use environment variable for API Key

    articles.forEach(article => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastRequestTime;

      let articleText = article.article_text;

      // If the article text is too long, truncate it
      if (articleText.length > MAX_TOKENS) {
        console.log(`Article ${article._id} is too long with ${articleText.length} tokens. Truncating to ${MAX_TOKENS} tokens.`);
        articleText = articleText.substring(0, MAX_TOKENS);
      }

      const tokensForCurrentRequest = articleText.length;

      // If this request will exceed the TPM, delay by the required time
      if (tokensUsedInLastMinute + tokensForCurrentRequest > MAX_TPM) {
        Meteor._sleepForMs(TOKEN_RESET_INTERVAL - elapsedTime);
        tokensUsedInLastMinute = 0;
        lastRequestTime = Date.now();
      }

      // Make the API call
      try {
        const response = HTTP.post('https://api.openai.com/v1/embeddings', {
          headers: {
            Authorization: `Bearer ${openaiAPIKey}`,
            'Content-Type': 'application/json',
          },
          data: {
            model: 'text-embedding-ada-002',
            input: articleText,
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

      // Update the tokens used and last request time
      tokensUsedInLastMinute += tokensForCurrentRequest;
      lastRequestTime = currentTime;
    });
  },
});
