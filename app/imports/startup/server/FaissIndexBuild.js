import { IndexFlatL2 } from 'faiss-node';
import { Meteor } from 'meteor/meteor';
import { Askus } from '../../api/askus/Askus';

/**
 * Builds and saves a FAISS index from the embeddings in the database.
 */
async function buildFAISSIndex() {
  try {
    console.log('Starting to build FAISS index...');

    // Fetch all articles and their embeddings from the database
    const articles = Askus.collection.find({}).fetch();
    console.log(`Fetched ${articles.length} articles from the database.`);

    const embeddings = articles.map(article => article.embedding);

    // Check if there are embeddings to index
    if (embeddings.length === 0) {
      console.error('No embeddings found to index.');
      return;
    }

    // Check that all embeddings have the same length
    const d = embeddings[0].length;
    if (!embeddings.every(emb => emb.length === d)) {
      console.error('Not all embeddings have the same dimension.');
      return;
    }

    console.log('Creating a new FAISS index...');
    // Create a new FAISS index
    const index = new IndexFlatL2(d);

    console.log('Adding embeddings to the index...');
    // Add each embedding to the index
    embeddings.forEach(embedding => {
      // Convert the individual embedding to a regular array
      const embeddingArray = Array.from(embedding);
      // Add the embedding to the index
      index.add(embeddingArray);
    });

    // Save the index to a file
    const fname = 'faiss.index';
    console.log(`Saving the index to file: ${fname}`);
    // Write the index directly to the file
    index.write(fname);
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`FAISS index built and saved to ${fname}`);

  } catch (error) {
    console.error('Error building FAISS index:', error);
  }
}

// Meteor method to build and save the FAISS index
Meteor.methods({
  async buildFAISSIndex() {
    await buildFAISSIndex();
  },
});

export default buildFAISSIndex;
