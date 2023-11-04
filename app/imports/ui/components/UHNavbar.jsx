import React from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { Facebook, Instagram, Twitter, Youtube } from 'react-bootstrap-icons';

const UHNavbar = () => (
  <Navbar className="navbarColor" expand="lg">
    <Container>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto justify-content-start">
          <Nav.Link href="https://www.hawaii.edu/">UH Home</Nav.Link>
          <Nav.Link href="https://www.hawaii.edu/directory/">Directory</Nav.Link>
          <Nav.Link href="https://myuh.hawaii.edu/">MyUH</Nav.Link>
          <Nav.Link href="http://workatuh.hawaii.edu/">Work at UH</Nav.Link>
          <Nav.Link href="https://apply.hawaii.edu/">Apply</Nav.Link>
        </Nav>
        <Nav className="justify-content-end">
          <Nav.Link href="https://twitter.com/UHawaiiNews"><Twitter /></Nav.Link>
          <Nav.Link href="https://www.facebook.com/universityofhawaii"><Facebook /></Nav.Link>
          <Nav.Link href="https://www.instagram.com/uhawaiinews/"><Instagram /></Nav.Link>
          <Nav.Link href="https://www.flickr.com/photos/uhawaii"><Image src="/images/icon-flickr.png" width={15} /></Nav.Link>
          <Nav.Link href="https://www.youtube.com/user/uhmagazine"><Youtube /></Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default UHNavbar;
