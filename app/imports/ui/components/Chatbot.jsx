import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const ChatBox = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnswer('');
    setError('');

    Meteor.call('askus.getAnswer', question, (err, res) => {
      if (err) {
        setError(err.reason);
      } else {
        setAnswer(res);
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
          {answer && (
            <Alert variant="info" className="mt-4">
              <strong>Answer:</strong> {answer}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBox;
