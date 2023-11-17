import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Chatbot from '../components/Chatbot';
import { Sessions } from '../../api/session/Sessions';

/* Page that contains the chatbot */
const ChatbotPage = () => {
  const question = localStorage.getItem('questionAsked') ? localStorage.getItem('questionAsked') : '';
  localStorage.removeItem('questionAsked');

  const sentAt = new Date();
  // test variable values on initial page load and generate session id
  useEffect(() => {
    let sessionId = sessionStorage.getItem('chatbotSessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('chatbotSessionId', sessionId);
      Sessions.collection.insert(
        {
          latestQuery: 'temp',
          sentAt: sentAt,
          userId: Meteor.user() ? Meteor.user().username : 'notLoggedIn',
          _id: sessionId,
        },
        (error, result) => {
          if (error) {
            console.log('Insert Error:', error);
          } else {
            console.log('Insert Result:', result);
          }
        },
      );
    }
    console.log(`Session ID: ${sessionId}`);
    console.log(`User ID: ${Meteor.user() ? Meteor.user().username : 'notLoggedIn'}`);
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
