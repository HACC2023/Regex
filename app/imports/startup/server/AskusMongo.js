import { Meteor } from 'meteor/meteor';
import { Askus } from '../../api/askus/Askus.js';

/* eslint-disable no-console */

// Function to add data to the Askus collection.
const addDataToAskus = (data) => {
  console.log(`  Adding: ${data.filename} (Question: ${data.question})`);
  Askus.collection.insert(data);
};

// Initialize the Askus collection if empty.
Meteor.startup(() => {
  if (Askus.collection.find().count() === 0) {
    console.log('No data found in Askus collection. Initializing with default data.');

    try {
      // Read the JSON data from the /data/parsed_articles.json file.
      // eslint-disable-next-line no-undef
      const jsonData = JSON.parse(Assets.getText('data/parsed_articles.json'));

      // Insert each record from the JSON file into the Askus collection, but only if it contains the article_text.
      jsonData.forEach(record => {
        if (record.article_text) { // Check if article_text exists and is not empty
          addDataToAskus({
            filename: record.filename,
            question: record.question,
            article_text: record.article_text,
            freq: 0,
          });
        } else {
          console.warn(`Skipping record with filename: ${record.filename} due to missing article_text`);
        }
      });

      console.log('Default data inserted into Askus collection.');
    } catch (error) {
      console.error('Error reading or inserting data into Askus collection:', error);
    }
  } else {
    console.log('Askus collection already has data. No default data inserted.');
  }
});
