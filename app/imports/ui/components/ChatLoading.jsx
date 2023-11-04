import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const ChatLoading = () => (
  <Container className="d-flex align-items-center px-1 pt-2">
    <Spinner animation="border" variant="primary" />
    <div className="mx-2">Loading...</div>
  </Container>
);

export default ChatLoading;
