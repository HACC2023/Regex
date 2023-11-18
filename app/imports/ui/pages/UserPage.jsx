import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { v4 as uuidv4 } from 'uuid';
import { Sessions } from '../../api/session/Sessions';
import ChatHistory from '../components/ChatHistory';
import LoadingBar from '../components/LoadingBar';

const addSession = (sessionID) => {
  const sentAt = new Date();
  console.log(`New Session ${sessionID} added`);
  Sessions.collection.insert(
    {
      latestQuery: '',
      sentAt: sentAt,
      userId: Meteor.user() ? Meteor.user().username : 'notLoggedIn',
      _id: sessionID,
    },
  );
  sessionStorage.setItem('chatbotSessionId', sessionID);
};

const deleteSession = (sessionID) => {
  console.log(`Session ${sessionID} deleted`);
  Sessions.collection.remove(sessionID);
};
const UserPage = () => {

  const { ready, sessions } = useTracker(() => {
    const subscription = Meteor.subscribe(Sessions.userPublicationName);
    const rdy = subscription.ready();
    const userToFind = Meteor.user() ? Meteor.user().username : 'notLoggedIn';
    const sessionItems = Sessions.collection.find({ userId: userToFind }).fetch();
    sessionItems.sort((a, b) => a.date - b.date);
    return {
      sessions: sessionItems,
      ready: rdy,
    };
  }, []);

  return (
    <Container>
      <h1> History </h1>
      <Col lg={6}>
        {ready ? (
          <Table striped bordered hover>
            <tbody>
              {sessions.slice().reverse().map((session) => (
                <ChatHistory key={session._id} session={session} collection={Sessions.collection} deleteSession={deleteSession} />
              ))}
            </tbody>
          </Table>
        ) : <LoadingBar now={100 * (sessions.length / 100)} size={7} />}
      </Col>
      <Button variant="success " onClick={() => addSession(uuidv4())}> New thread </Button>
    </Container>
  );
};

export default UserPage;
