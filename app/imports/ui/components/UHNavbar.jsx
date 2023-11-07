import React from 'react';
import { Button, Col, Container, Image, Nav, Navbar, Row, NavDropdown } from 'react-bootstrap';
import { Facebook, Instagram, Search, Twitter, Youtube } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import EmbeddedButton from './EmbeddedButton';

const UHNavbar = () => (
  <div>
    <Navbar className="navbarColor" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="underline" className="me-auto justify-content-start">
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
    <div className="logo">
      <Container>
        <Row>
          <Col className="col-7 mt-4 ms-2">
            <Image src="/images/uh-nameplate.png" className="mt-3" width={450} />
          </Col>
          <Col className="col-2 m-5">
            <div style={{ position: 'relative' }}>
              <input placeholder="Site Search" className="form-control siteSearch" />
              <Button variant="link" style={{ position: 'absolute', right: 0, top: 0 }}>
                <Search className="search" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="gray-background">
        <Container>
          <Nav variant="underline" className="bottom-nav"><Nav.Link className="ms-2" href="https://www.hawaii.edu/its"><h3>Information Technology Services</h3></Nav.Link></Nav>
          <Nav.Link className="ms-2"><p>University of Hawaii System</p></Nav.Link>
        </Container>
      </div>
    </div>
    <div className="bottom-nav">
      <Container>
        <Nav variant="underline" className="justify-content-start bottom-nav ms-2">
          <Nav.Link href="https://www.hawaii.edu/its/help-desk/index.html">HELP DESK</Nav.Link>
          <Nav.Link href="https://www.hawaii.edu/its/services/">ITS Services</Nav.Link>
          <Nav.Link href="https://www.hawaii.edu/infosec/">INFORMATION SECURITY</Nav.Link>
          <Nav.Link href="https://www.hawaii.edu/its/alerts/">ALERTS</Nav.Link>
          <NavDropdown title="ABOUT">
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/">About</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/about-cio/index.html">VP for Information Technology and Chief Information Officer</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/academic-development-and-technology-adt/index.html">Academic Development and Technology (ADT)</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/academic-technologies/index.html">Academic Technologies</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/csoc/index.html">Client Service and Operations Center (CSOC)</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/cyberinfrastructure/index.html">Cyberinfrastructure</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/enterprise-systems/index.html">Enterprise Systems</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/information-security/index.html">Information Security</NavDropdown.Item>
            <NavDropdown.Item href="https://www.hawaii.edu/its/about/information-security/index.html">Technology Infrastructure</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="https://www.hawaii.edu/askus/">ASK US</Nav.Link>
          <Nav.Link href="https://www.hawaii.edu/its/contact/">CONTACT ITS</Nav.Link>
        </Nav>
      </Container>

      <Container id="dev-tools">
        <Nav className="me-auto justify-content-end">
          <Nav.Link id="landing" as={NavLink} to="/" key="landing">Landing</Nav.Link>
          <Nav.Link id="chatbot-nav" as={NavLink} to="/chatbot" key="chatbot">Chatbot</Nav.Link>
          <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>
        </Nav>
      </Container>
    </div>
  </div>
);

export default UHNavbar;
