import React, { useState } from 'react';
import { Button, Container, Form, Col, Row } from 'react-bootstrap';

/** Renders a search bar that accepts input and redirects user to chatbot page */
const LandingSearch = () => {
  const [userInput, setUserInput] = useState('');

  // Handles user pressing button; stores input locally then redirects page to chatbot.
  const redirect = (e) => {
    e.preventDefault();
    localStorage.setItem('questionAsked', userInput);
    window.location.assign('/chatbot');
    return false;
  };

  return (
    // This is for mobile view
    <div>
      <Form onSubmit={redirect} className="d-block d-sm-none mt-3">
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
      {/* This is for desktop view */}
      <Container className="landingSearchContainer pt-3 pb-5 px-sm-5">
        <Row>
          <Col xs={12} sm={3} />
          <Col xs={12} sm={6}>
            <Form onSubmit={redirect} className="d-none d-sm-block mt-3">
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
    </div>
  );
};

export default LandingSearch;
