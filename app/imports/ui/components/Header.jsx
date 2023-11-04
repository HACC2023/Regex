import React from 'react';
import { Col, Container, Form, Image, Row } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

const Header = () => (
  <Container>
    <Row>
      <Col>
        <Image src="/images/uh-nameplate.png" className="mt-3"/>
      </Col>
      <Col className="col-3 input-wrapper">
        <input placeholder="Site Search" />
        <Search />
      </Col>
    </Row>
  </Container>
);

export default Header;
