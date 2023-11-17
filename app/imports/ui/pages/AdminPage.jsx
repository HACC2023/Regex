import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row } from 'react-bootstrap';
import { AskUs } from '../../api/askus/AskUs';
import { useChartData } from '../components/ChartDataHook';
import BarChartComponent from '../components/AdminBarChart';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusSquare from '../components/StatusSquare';
import EmbeddedButton from '../components/EmbeddedButton';
import UpdateDatabaseButton from '../components/AskUsCollectionUpdateButton';
import PaginationTable from '../components/PaginationTable';

/* Renders a table containing all of the Stuff documents. Use <PaginationTableItem> to render each row. */
const AdminPage = () => {
  const [complete, setComplete] = useState(false);
  const [complete2, setComplete2] = useState(false);

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
  }, []);

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
  }, []);

  return (
    <Container>
      <Container>
        <p><a href="https://askuh.info">Home</a> &gt; Admin</p>
      </Container>
      <Row className="justify-content-center">
        <h2 className="text-center pb-3" style={{ textDecoration: 'underline' }}>System Analytics</h2>

        <Col lg={6}>
          <PaginationTable itemsPerPage={10} />
        </Col>

        <Col lg={1} />

        <Col className="justify-content-md-center" lg={5}>
          <Row className="g-0"><h5>Startup Features</h5></Row>
          <Row className="text-center g-0 mb-1">
            <Col>
              <EmbeddedButton />
            </Col>
            <Col>
              <StatusSquare complete={complete} size={1} />
            </Col>
          </Row>

          <Row className="text-center g-0 mb-1">
            <Col>
              <UpdateDatabaseButton />
            </Col>
            <Col>
              <StatusSquare complete={complete2} />
            </Col>
          </Row>

        </Col>

      </Row>

    </Container>
  );
};

export default AdminPage;
