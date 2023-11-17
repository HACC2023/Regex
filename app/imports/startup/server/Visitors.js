import { Meteor } from 'meteor/meteor';
import { Visits } from '../../api/visit/Visits';

/* eslint-disable no-console */

// Function to add data to the Visits collection.
const addDataToVisits = (data) => {
  console.log(`  Adding: ${data.pageName} (Visits: ${data.visitCount})`);
  Visits.collection.insert(data);
};

// Initialize the Askus collection if empty.
Meteor.startup(() => {
  if (Visits.collection.find().count() === 0) {
    console.log('No data found in Visits collection. Initializing with default data.');
    addDataToVisits({
      pageUrl: 'chatbot',
      pageName: 'Chatbot',
      visitCount: 0,
    });
  }
});
