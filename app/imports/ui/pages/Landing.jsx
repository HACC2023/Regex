import React from 'react';
import { Container } from 'react-bootstrap';
import Chatbot from '../components/Chatbot';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid className="py-3">
    <Chatbot />
  </Container>
);

export default Landing;
