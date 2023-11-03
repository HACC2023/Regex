import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * Represents a collection for storing articles and related data within the Askus system.
 * This collection is central to the Askus system, as it stores the articles that users
 * can query against using the chatbot interface.
 */
class AskusCollection {
  /**
   * Initializes a new instance of the AskusCollection.
   * Sets up the MongoDB collection, defines the schema for documents, and attaches the schema
   * to the collection. It also defines publication names for user and admin roles.
   */
  constructor() {
    // The name of this collection.
    this.name = 'AskusCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    /**
     * The schema defining the structure of each document in the collection.
     * Documents in this collection represent individual articles, including metadata
     * like filename and associated questions, as well as the article's text content.
     * Embeddings, which are optional, are used for semantic similarity calculations.
     * @type {SimpleSchema}
     */
    this.schema = new SimpleSchema({
      filename: String,
      question: String,
      article_text: String,
      freq: Number,
      embedding: { type: Array, optional: true }, // Add this line
      'embedding.$': Number, // Each item in the embedding array is a Number
      // Add more fields if necessary
    });
    // Attach the schema to the collection.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

// The singleton instance of the AskusCollection.
export const Askus = new AskusCollection();
