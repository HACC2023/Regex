import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class ChatsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ChatsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      sender: String,
      message: String,
      sessionId: String,
      userId: String,
      // Add more fields if necessary
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
 * @type {AskUsCollection}
 */
export const Chats = new ChatsCollection();
