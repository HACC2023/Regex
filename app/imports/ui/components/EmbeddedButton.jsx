import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';

const EmbeddingButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGenerateEmbeddings = () => {
    setLoading(true);

    Meteor.call('generateAndStoreEmbeddings', (err) => {
      if (err) {
        swal('Error', `${err.reason}`, 'error');
      } else {
        swal('Success', 'Embeddings generated and stored successfully', 'success');
      }
      setLoading(false);
    });
  };

  return (
    <Button variant="secondary" onClick={handleGenerateEmbeddings} disabled={loading} style={{ textDecoration: 'none' }}>
      {loading ? 'Generating Embeddings...' : 'Generate Embeddings'}
    </Button>
  );
};

export default EmbeddingButton;
