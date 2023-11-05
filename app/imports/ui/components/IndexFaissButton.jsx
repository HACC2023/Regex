import React from 'react';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const IndexFAISSButton = () => {
  const handleBuildFAISSIndex = () => {
    Meteor.call('buildFAISSIndex', (err) => {
      if (err) {
        alert('Error:', err.reason);
      } else {
        alert('FAISS index built and saved successfully');
      }
    });
  };

  return (
    <Button variant="primary" onClick={handleBuildFAISSIndex}>
      Build FAISS Index
    </Button>
  );
};

export default IndexFAISSButton;
