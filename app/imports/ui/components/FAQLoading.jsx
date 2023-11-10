import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FAQLoading = (props) => {
  const { now } = props;

  return (
    <Container className="pt-4 pb-5">
      <Row className="justify-content-md-center">
        Loading...
      </Row>
      <Row className="justify-content-md-center pt-2">
        <Col xs={1}>
          <ProgressBar now={now} label={`${now}%`} animated striped />
        </Col>
      </Row>
    </Container>
  );
};

FAQLoading.propTypes = {
  now: PropTypes.number.isRequired,
};

export default FAQLoading;
