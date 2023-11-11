import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';

const UpdateDatabaseButton = () => {
  const handleUpdateClick = async () => {
    try {
      // Fetch JSON data using a Meteor method
      Meteor.call('getJsonData', (error, result) => {
        if (error) {
          console.error('Error fetching JSON data:', error);
        } else {
          const jsonData = result;
          // Now call the updateDatabase method with the fetched JSON data
          Meteor.call('askus.updateDatabase', jsonData, (updateError) => {
            if (updateError) {
              console.error('Error updating database:', updateError);
            } else {
              console.log('Database successfully updated');
            }
          });
        }
      });
    } catch (error) {
      console.error('Error in handleUpdateClick:', error);
    }
  };

  return (
    <Button onClick={handleUpdateClick}>
      Update AskUs Database
    </Button>
  );
};

export default UpdateDatabaseButton;
