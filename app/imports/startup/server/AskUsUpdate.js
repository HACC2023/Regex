import { Meteor } from 'meteor/meteor';
import { AskUs } from '../../api/askus/AskUs.js';

/* global Assets */
let jsonData = [];

// Load the JSON data on server startup
Meteor.startup(() => {
  try {
    const files = ['data/challenge_one.json', 'data/challenge_three.json']; // Add more filenames as needed
    jsonData = files.flatMap(file => {
      const data = Assets.getText(file);
      return JSON.parse(data);
    });
    console.log('JSON data loaded successfully from all files.');
  } catch (error) {
    console.error('Error loading JSON data:', error);
  }
});

Meteor.methods({
  // Method to get the preloaded JSON data
  'getJsonData'() {
    return jsonData;
  },

  // Method to update the database
  'askus.updateDatabase'() {
    console.log('Starting database update process...');
    jsonData.forEach((record, index) => {
      if (record.article_text) {
        console.log(`Processing record ${index + 1}:`, record.filename);
        AskUs.collection.update(
          { filename: record.filename },
          {
            $set: {
              question: record.question,
              article_text: record.article_text,
              freq: record.freq || 0,
            },
          },
          { upsert: true },
          (error, result) => {
            if (error) {
              console.error(`Error updating record ${index + 1}:`, error);
            } else if (result.upsertedId) {
              console.log(`Inserted new record for filename: ${record.filename}`);
            } else {
              console.log(`Updated existing record for filename: ${record.filename}`);
            }
          },
        );
      } else {
        console.warn(`Skipping record ${index + 1} due to missing article_text:`, record.filename);
      }
    });
    console.log('Database update process completed.');
  },
});
