import React from 'react';
import { Col, Container, Image, Nav, Row } from 'react-bootstrap';
import { Facebook, Instagram, Twitter, Youtube } from 'react-bootstrap-icons';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const UHFooter = () => (
  <footer>
    <div id="footer_top">
      <Container>
        <hr />
        <Row>
          <Col className="text-start mt-3">
            <h4>Information Technology</h4>
            <h4>Services (Site)</h4>
            <p className="mb-3">Information Technology Center</p>
            <p className="mb-3">2520 Correa Road</p>
            <p className="mb-3">Honolulu, Hawaii 96822</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-start mt-3">
            <h5>Contact Us</h5>
            <p className="mb-3">Telephone: (808) 956-8883</p>
            <p className="mb-5">Email: help@hawaii.edu</p>
          </Col>
        </Row>
      </Container>
    </div>
    <div id="footer_btm">
      <Container>
        <Row>
          <Col sm={6} lg={3}>
            <Image className="pb-2" src="/images/footer-logo.png" />
            <br />
            2444 Dole Street
            <br />
            Honolulu, HI 96822
            <br />
            <br />
          </Col>
          <Col sm={6} lg={3}>
            An <a href="https://www.hawaii.edu/offices/eeo/policies/">equal opportunity/affirmative action institution</a>
            Use of this site implies consent with our <a href="https://www.hawaii.edu/policy/docs/temp/ep2.210.pdf">Usage Policy</a>
            copyright © 2018 <a href="https://www.hawaii.edu/">University of Hawaiʻi</a>
            <br />
            <br />
          </Col>
          <Col sm={6} lg={3}>
            <a href="https://www.hawaii.edu/calendar/">Calendar</a>
            <br />
            <a href="https://www.hawaii.edu/directory/">Directory</a>
            <br />
            <a href="https://www.hawaii.edu/emergency/">Emergency Information</a>
            <br />
            <a href="https://myuh.hawaii.edu/">MyUH</a>
            <br />
            <a href="https://www.hawaii.edu/privacy/">Privacy Statement</a>
            <br />
            <a href="https://www.schooljobs.com/careers/hawaiiedu">Work at UH</a>
            <br />
            <br />
          </Col>
          <Col sm={6} lg={3}>
            <Nav className="footerIcons">
              <Nav.Link className="custom-navlink" href="https://twitter.com/UHawaiiNews"><Twitter /></Nav.Link>
              <Nav.Link className="custom-navlink" href="https://www.facebook.com/universityofhawaii"><Facebook /></Nav.Link>
              <Nav.Link className="custom-navlink" href="https://www.instagram.com/uhawaiinews/"><Instagram /></Nav.Link>
              <Nav.Link className="custom-navlink" href="https://www.flickr.com/photos/uhawaii"><Image src="/images/icon-flickr.png" width={15} /> </Nav.Link>
              <Nav.Link className="custom-navlink mb-3" href="https://www.youtube.com/user/uhmagazine"><Youtube /></Nav.Link>
            </Nav>
            <a href="https://www.hawaii.edu/contact/">Contact UH</a>
            <br />
            If required, information contained on this website can be made available in an alternative format upon request.
            <br />
            <br />
            <a href="https://get.adobe.com/reader/">Get Adobe Acrobat Reader</a>
          </Col>
        </Row>
      </Container>
    </div>
  </footer>
);

export default UHFooter;
