import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Container, Spinner, Image } from 'react-bootstrap';

const ChatLoading = () => (
  <Image src="/images/loading.gif" width="120em" className="px-2" />
  /* <Container className="d-flex align-items-center px-1 pt-2">
    <Spinner animation="border" variant="primary" />
    <div className="mx-2">Loading...</div>
  </Container> */
);

export default ChatLoading;
