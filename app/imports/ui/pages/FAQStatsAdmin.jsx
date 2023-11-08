import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { AskUs } from '../../api/askus/AskUs';
import StatItemAdmin from '../components/StatItemAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
import EmbeddedButton from '../components/EmbeddedButton';

/* Renders a table containing all of the Stuff documents. Use <StatItemAdmin> to render each row. */
const FAQStatsAdmin = () => {
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
        <Col md={7}>
          <Col className="text-center">
            <h2>Admin Stats</h2>
            <EmbeddedButton />
          </Col>
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
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default FAQStatsAdmin;
