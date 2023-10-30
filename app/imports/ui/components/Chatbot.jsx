import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const ChatBox = () => {
  const [question, setQuestion] = useState('');
  const [mainAnswer, setMainAnswer] = useState(''); // Main answer
  const [mainFilename, setMainFilename] = useState(''); // Main filename
  const [similarArticles, setSimilarArticles] = useState([]); // New state for similar articles
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMainAnswer('');
    setMainFilename('');
    setSimilarArticles([]);
    setError('');

    Meteor.call('askus.getAnswer', question, (err, res) => {
      if (err) {
        setError(err.reason);
      } else {
        setMainAnswer(res[0].article_text);
        setMainFilename(res[0].filename);
        setSimilarArticles(res.slice(1)); // Exclude the main answer
      }
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ask your question:</Form.Label>
              <Form.Control
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Ask
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}
          {mainAnswer && (
            <Alert variant="info" className="mt-4">
              <strong>Top Answer from {mainFilename}:</strong> {mainAnswer}
            </Alert>
          )}

          {similarArticles.length > 0 && (
            <div className="mt-4">
              <h5>Other similar articles:</h5>
              <ul>
                {similarArticles.map((article, index) => (
                  <li key={index}>
                    <strong>From {article.filename}:</strong> {article.article_text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBox;
