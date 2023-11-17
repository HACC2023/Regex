import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Chatbot from '../components/Chatbot';

/* Page that contains the chatbot */
const ChatbotPage = () => {
  const question = localStorage.getItem('questionAsked') ? localStorage.getItem('questionAsked') : '';
  localStorage.removeItem('questionAsked');

  // test variable values on initial page load and generate session id
  useEffect(() => {
    let sessionId = sessionStorage.getItem('chatbotSessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('chatbotSessionId', sessionId);
    }
    console.log(`Session ID: ${sessionId}`);
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
