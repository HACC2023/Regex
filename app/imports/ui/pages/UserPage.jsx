import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Sessions } from '../../api/session/Sessions';
import ChatHistory from '../components/ChatHistory';
import LoadingBar from '../components/LoadingBar';

const UserPage = () => {

  const { ready, sessions } = useTracker(() => {
    const subscription = Meteor.subscribe(Sessions.userPublicationName);
    const rdy = subscription.ready();
    const userToFind = Meteor.user() ? Meteor.user().username : 'notLoggedIn';
    console.log(userToFind);
    const sessionItems = Sessions.collection.find({ userId: userToFind }).fetch();
    return {
      sessions: sessionItems,
      ready: rdy,
    };
  }, []);

  return (
    <Container>
      <Col lg={6}>
        {ready ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {console.log(sessions)}
              {sessions.map((session) => <ChatHistory key={session._id} session={session} />)}
            </tbody>
          </Table>
        ) : <LoadingBar now={100 * (sessions.length / 100)} size={7} />}

      </Col>
    </Container>
  );
};

export default UserPage;
