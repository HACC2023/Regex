import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const EmbeddingButton = (props) => {
  const page = props;
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleGenerateEmbeddings = () => {
    setLoading(true);

    Meteor.call('generateAndStoreEmbeddings', (err) => {
      if (err) {
        alert('Error:', err.reason);
      } else {
        setComplete(true);
        alert('Embeddings generated and stored successfully');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (page.props.embedding) {
      setComplete(true);
    }
  }, []);

  return (
    <Row sm={3}>
      <Col>
        <Button variant="secondary" onClick={handleGenerateEmbeddings} disabled={loading} style={{ textDecoration: 'none' }}>
          {loading ? 'Generating Embeddings...' : 'Generate Embeddings'}
        </Button>
      </Col>
      <Col>
        {complete ? <div className="square" style={{ backgroundColor: 'lightgreen' }} /> : <div className="square" style={{ backgroundColor: 'red' }} />}
      </Col>
    </Row>
  );
};

export default EmbeddingButton;
