import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import LandingSearch from '../components/LandingSearch';
import FAQCards from '../components/FAQCards';
import Notifications from '../components/Notifications';
import { Sessions } from '../../api/session/Sessions';

/* A simple component to render the landing page. */
const Landing = () => {
  useEffect(() => {
    const sentAt = new Date();
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
    <Container id="landing-page" fluid>
      <Container className="px-3">
        <p><a href="https://askuh.info">Home</a> &gt; Ask Us</p>
      </Container>
      <LandingSearch />
      <FAQCards />
      <Notifications />
    </Container>
  );
};

export default Landing;
