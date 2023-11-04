import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const EmbeddingButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGenerateEmbeddings = () => {
    setLoading(true);

    Meteor.call('generateAndStoreEmbeddings', (err) => {
      if (err) {
        alert('Error:', err.reason);
      } else {
        alert('Embeddings generated and stored successfully');
      }
      setLoading(false);
    });
  };

  return (
    <Button variant="link" onClick={handleGenerateEmbeddings} disabled={loading} style={{ color: 'black', textDecoration: 'none' }}>
      {loading ? 'Generating Embeddings...' : 'Generate Embeddings'}
    </Button>
  );
};

export default EmbeddingButton;
