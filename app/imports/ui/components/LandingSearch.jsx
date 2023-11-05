import React, { useState } from 'react';
import { Button, Container, Form, Col, Row } from 'react-bootstrap';

/** Renders a search bar that accepts input and redirects user to chatbot page */
const LandingSearch = () => {
  const [userInput, setUserInput] = useState('');

  const redirect = (e) => {
    e.preventDefault();
    localStorage.setItem('questionAsked', userInput);
    window.location.assign('/chatbot');
    return false;
  };

  return (
    <Container className="landingSearchContainer px-5 py-5">
      <Row>
        <Col xs={3} />
        <Col xs={6}>
          <Form onSubmit={redirect} className="mt-3">
            <div className="d-flex">
              <Form.Control
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Have a question?"
                required
              />
              <Button type="submit" className="landingSearchButton ms-2">Ask Us</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingSearch;
