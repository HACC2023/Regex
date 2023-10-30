import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class AskusCollection {
  constructor() {
    // The name of this collection.
    this.name = 'AskusCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      filename: String,
      question: String,
      article_text: String,
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
