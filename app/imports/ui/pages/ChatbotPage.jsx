import React, { useEffect } from 'react';
import { Col, Container } from 'react-bootstrap';
import Chatbot from '../components/Chatbot';

/* Page that contains the chatbot */
const ChatbotPage = () => {
  const question = localStorage.getItem('questionAsked') ? localStorage.getItem('questionAsked') : '';
  localStorage.removeItem('questionAsked');

  // test variable values on initial page load
  useEffect(() => {
    // alert(question);
    // console.log(question);
  }, []);

  return (
    <Container id="chatbot-page" fluid>
      <Container>
        <p><a href="https://askuh.info">Home</a> &gt; ChatBot</p>
      </Container>
      <Chatbot input={question} />
    </Container>
  );
};

export default ChatbotPage;
