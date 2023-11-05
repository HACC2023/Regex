import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
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
    <Container id="chatbot-page" fluid className="py-3">
      <Chatbot input={question} />
    </Container>
  );
};

export default ChatbotPage;
