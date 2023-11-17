import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class VisitCollection {
  constructor() {
    // The name of this collection.
    this.name = 'VisitCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      pageUrl: String,
      pageName: String,
      visitCount: Number,
    });
    // Attach the schema to the collection.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the AskUsCollection.
 * @type {VisitCollection}
 */
export const Visits = new VisitCollection();
