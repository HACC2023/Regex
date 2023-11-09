import { Meteor } from 'meteor/meteor';
import { AskUs } from '../../api/askus/AskUs.js';

Meteor.startup(() => {
  // Create an index on the 'embedding' field if you're querying it often
  AskUs.collection.createIndex({ embedding: 1 });

  // If you have any compound queries that use both 'embedding' and another field frequently, you can create a compound index
  // For example, if you often find articles by 'embedding' and 'date', you would create a compound index like this:
  AskUs.collection.createIndex({ embedding: 1, date: -1 });

  // Ensure that there is an index on any field used for sorting or in a query selector
  // For example, if you often sort or query by 'filename', you would create an index like this:
  AskUs.collection.createIndex({ filename: 1 });

  // If you perform text searches on 'article_text', create a text index
  AskUs.collection.createIndex({ article_text: 'text' });

  // If you need to ensure unique values in a field (such as a unique article identifier), you can create a unique index
  AskUs.collection.createIndex({ uniqueArticleId: 1 }, { unique: true });

  // Add more index creation as needed based on your query patterns
  // ...

  console.log('Database indexes have been created.');
});
