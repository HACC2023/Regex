import React from 'react';
import { Container } from 'react-bootstrap';
import Chatbot from '../components/Chatbot';

/* Page that contains the chatbot */
const ChatbotPage = () => (
  <Container id="chatbot-page" fluid className="py-3">
    <Chatbot />
  </Container>
);

export default ChatbotPage;
