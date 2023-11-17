import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Card } from 'react-bootstrap';
import BarChartComponent from '../components/AdminBarChart';
import StatusSquare from '../components/StatusSquare';
import EmbeddedButton from '../components/EmbeddedButton';
import UpdateDatabaseButton from '../components/AskUsCollectionUpdateButton';
import PaginationTable from '../components/PaginationTable';
import AvgResponseAdmin from '../components/AvgResponseAdmin';
// eslint-disable-next-line no-unused-vars
import DragNDrop from '../components/DragNDrop';

/* Renders a table containing all of the Stuff documents. Use <PaginationTableItem> to render each row. */
const AdminPage = () => {
  const [complete, setComplete] = useState(false);
  const [complete2, setComplete2] = useState(false);

  // Replace this when send times are implemented in message collection
  const testData = [{ label: 'Week 1', value: 13 }, { label: 'Week 2', value: 57 }, { label: 'Week 3', value: 32 }, { label: 'Week 4', value: 79 }];

  // Retrieve status of db using meteor functions.
  useEffect(() => {
    Meteor.call('embedExist', (error, result) => {
      if (error) {
        console.error('Error getting embed status:', error);
      } else {
        // console.log('Status:', result);
      }
      setComplete(result);
    });
  });

  // Retrieve status of FERPA using meteor functions.
  useEffect(() => {
    Meteor.call('otherDbExist', (error, result) => {
      if (error) {
        console.error('Error getting FERPA status:', error);
      } else {
        // console.log('Status:', result);
      }
      setComplete2(result);
    });
  });

  return (
    <Container>
      <Container>
        <p><a href="https://askuh.info">Home</a> &gt; Admin</p>
      </Container>

      <Row className="justify-content-center">
        <h2 className="text-center pb-3" style={{ textDecoration: 'underline' }}>System Dashboard</h2>
      </Row>

      <Row>
        <Col lg={6}>
          <PaginationTable itemsPerPage={10} />
        </Col>

        <Col className="justify-content-md-center text-center" lg={6}>
          <Row className="mb-3">
            <Card>
              <BarChartComponent data={testData} />
            </Card>
          </Row>
          <Row>

            <Col>
              <Card>
                <Card.Header>
                  <Row className="g-0"><h5>Startup Requirements</h5></Row>
                </Card.Header>
                <Row className="text-center g-0 my-1">
                  <Col>
                    <EmbeddedButton />
                  </Col>
                  <Col lg={2}>
                    <StatusSquare complete={complete} size={1} />
                  </Col>
                </Row>

                <Row className="text-center g-0 mb-1">
                  <Col>
                    <UpdateDatabaseButton />
                  </Col>
                  <Col lg={2}>
                    <StatusSquare complete={complete2} />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col>
              <AvgResponseAdmin />
            </Col>

          </Row>

          { /* Commented unused component for HACC
          <Row>
            <DragNDrop />
          </Row> */ }
        </Col>
      </Row>

    </Container>
  );
};

export default AdminPage;
