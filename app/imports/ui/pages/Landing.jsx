import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col className="col-12">
        <h1>chatbot goes here</h1>
      </Col>

    </Row>
  </Container>
);

export default Landing;
