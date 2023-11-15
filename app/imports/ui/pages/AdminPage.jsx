import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { AskUs } from '../../api/askus/AskUs';
import StatItemAdmin from '../components/StatItemAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusSquare from '../components/StatusSquare';
import EmbeddedButton from '../components/EmbeddedButton';
import UpdateDatabaseButton from '../components/AskUsCollectionUpdateButton';

/* Renders a table containing all of the Stuff documents. Use <StatItemAdmin> to render each row. */
const AdminPage = () => {
  const [complete, setComplete] = useState(false);
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

  // Checks if embeddings (for top 8 freq articles) exist
  useEffect(() => {
    let val = true;
    for (let i = 0; i < pages.length; i++) {
      if (!ready || (ready && !pages[i].embedding)) {
        val = false;
      }
    }
    setComplete(true);
  });

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <h2 className="text-center pb-3" style={{ textDecoration: 'underline' }}>System Analytics</h2>

        <Col lg={6}>
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

        <Col lg={1} />

        <Col className="justify-content-md-center" lg={5}>
          <Row className="g-0"><h5>Startup Features</h5></Row>
          <Row className="text-center g-0 mb-1">
            <Col>
              <EmbeddedButton />
            </Col>
            <Col>
              <StatusSquare complete={complete} />
            </Col>
          </Row>

          <Row className="text-center g-0 mb-1">
            <Col>
              <UpdateDatabaseButton />
            </Col>
            <Col>
              <StatusSquare complete={false} />
            </Col>
          </Row>
        </Col>

      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminPage;
