import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { AskUs } from '../../api/askus/AskUs';
import StatItemAdmin from '../components/StatItemAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
import EmbeddedButton from '../components/EmbeddedButton';
import UpdateDatabaseButton from '../components/AskUsCollectionUpdateButton';

/* Renders a table containing all of the Stuff documents. Use <StatItemAdmin> to render each row. */
const AdminPage = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, pages } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(AskUs.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const items = AskUs.collection.find().fetch();
    return {
      pages: items,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <h2 className="text-center pb-3" style={{ textDecoration: 'underline' }}>Admin Stats</h2>
        <Col md={6}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Question</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => <StatItemAdmin key={page._id} page={page} />)}
            </tbody>
          </Table>
        </Col>
        <Col>
          <Col className="text-center">
            <EmbeddedButton props={pages[0]} />
          </Col>
          <Col>
            <UpdateDatabaseButton />
          </Col>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminPage;
