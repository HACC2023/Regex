import React from 'react';
import { Container } from 'react-bootstrap';
import LandingSearch from '../components/LandingSearch';
import FAQCards from '../components/FAQCards';

/* A simple component to render the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid className="py-3 text-center">
    <LandingSearch />
    <FAQCards />
  </Container>
);

export default Landing;
