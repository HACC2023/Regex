import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import LandingSearch from '../components/LandingSearch';
import FAQCards from '../components/FAQCards';
import { NavLink } from 'react-router-dom';

/* A simple component to render the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid>
    <Container className="px-3">
      <p><a href="https://www.hawaii.edu/its">Home</a> &gt; Ask Us</p>
    </Container>
    <LandingSearch />
    <FAQCards />
  </Container>
);

export default Landing;
