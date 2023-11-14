import React from 'react';
import { Button, Col, Container, Image, Nav, Navbar, Row, NavDropdown, InputGroup, FormControl } from 'react-bootstrap';
import { Facebook, Instagram, List, Search, Twitter, Youtube } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
// import EmbeddedButton from './EmbeddedButton'; // TODO: Remove this line when you remove the EmbeddedButton component.

const NavBar = () => (
  <div>
    <Navbar className="navbarColor" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav">Navigation <List /></Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="underline" className="me-auto justify-content-start">
            <Nav.Link href="https://www.hawaii.edu/">UH Home</Nav.Link>
            <Nav.Link href="https://www.hawaii.edu/directory/">Directory</Nav.Link>
            <Nav.Link href="https://myuh.hawaii.edu/">MyUH</Nav.Link>
            <Nav.Link href="https://workatuh.hawaii.edu/">Work at UH</Nav.Link>
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
          <Col lg={7} className="mt-4 ms-2">
            <Container>
              {/* Show this image on extra small screens */}
              <Image
                src="/images/uh-nameplate.png"
                alt="Image for Extra Small Screens"
                className="d-block d-sm-none mt-3"
                width={300}
              />

              {/* Show this image on small and larger screens */}
              <Image
                src="/images/uh-nameplate.png"
                alt="Image for Small and Larger Screens"
                className="d-none d-sm-block mt-3"
                width={450}
              />
            </Container>
          </Col>
          <Col className="m-5">
            <InputGroup className="mb-3 siteSearch">
              <FormControl
                placeholder="Site Search"
                aria-describedby="basic-addon2"
                className="search-boarder"
              />
              <Button id="button-addon2" className="search">
                <Search />
              </Button>
            </InputGroup>
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
      <Navbar expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggler-bottom">MENU<List className="pb-1" /></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav variant="underline" className="justify-content-start bottom-nav ms-2">
              <Nav.Link href="https://www.hawaii.edu/its/help-desk/index.html" target="_blank">HELP DESK</Nav.Link>
              <Nav.Link href="https://www.hawaii.edu/its/services/" target="_blank">ITS Services</Nav.Link>
              <Nav.Link href="https://www.hawaii.edu/infosec/" target="_blank">INFORMATION SECURITY</Nav.Link>
              <Nav.Link href="https://www.hawaii.edu/its/alerts/" target="_blank">ALERTS</Nav.Link>
              <NavDropdown align="end" title="ABOUT" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/" target="_blank">About</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/about-cio/index.html" target="_blank">
                  VP for Information Technology and Chief Information Officer
                </NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/academic-development-and-technology-adt/index.html" target="_blank">Academic Development and Technology (ADT)</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/academic-technologies/index.html" target="_blank">Academic Technologies</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/csoc/index.html" target="_blank">Client Service and Operations Center (CSOC)</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/cyberinfrastructure/index.html" target="_blank">Cyberinfrastructure</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/enterprise-systems/index.html" target="_blank">Enterprise Systems</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/information-security/index.html" target="_blank">Information Security</NavDropdown.Item>
                <NavDropdown.Item href="https://www.hawaii.edu/its/about/information-security/index.html" target="_blank">Technology Infrastructure</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="ASK US">
                { /* <NavDropdown.Item href="https://www.hawaii.edu/askus/">Ask Us</NavDropdown.Item> */ }
                <NavDropdown.Item id="landing" as={NavLink} to="/" key="landing">Home</NavDropdown.Item>
                <NavDropdown.Item id="chatbot-nav" as={NavLink} to="/chatbot" key="chatbot">Chatbot</NavDropdown.Item>
                <NavDropdown.Item id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="https://www.hawaii.edu/its/contact/">CONTACT ITS</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  </div>
);

export default NavBar;
