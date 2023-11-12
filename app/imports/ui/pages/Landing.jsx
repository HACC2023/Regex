import React from 'react';
import { Container } from 'react-bootstrap';
import LandingSearch from '../components/LandingSearch';
import FAQCards from '../components/FAQCards';

/* A simple component to render the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid>
    <Container className="px-3">
      <p><a href="https://askuh.info">Home</a> &gt; Ask Us</p>
    </Container>
    <LandingSearch />
    <FAQCards />
  </Container>
);

export default Landing;
