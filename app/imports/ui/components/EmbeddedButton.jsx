import React from 'react';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const EmbeddingButton = () => {
  const handleGenerateEmbeddings = () => {
    Meteor.call('generateAndStoreEmbeddings', (err) => {
      if (err) {
        alert('Error:', err.reason);
      } else {
        alert('Embeddings generated and stored successfully');
      }
    });
  };

  return (
    <Button variant="primary" onClick={handleGenerateEmbeddings}>
      Generate Embeddings
    </Button>
  );
};

export default EmbeddingButton;
