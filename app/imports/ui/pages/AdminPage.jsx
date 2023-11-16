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

  // Fetch and prepare data for the table
  const { ready, faq } = useTracker(() => {
    const subscription = Meteor.subscribe(AskUs.userPublicationName);
    const items = AskUs.collection.find().fetch();
    return {
      faq: items,
      ready: subscription.ready(),
    };
  }, []);

  // Fetch and prepare data for the chart using useChartData hook
  const { chartData, chartReady } = useChartData(); // Use the custom hook

  // Checks if embeddings (for top 8 freq articles) exist
  useEffect(() => {
    let val = true;
    for (let i = 0; i < faq.length; i++) {
      if (!ready || (ready && !faq[i].embedding)) {
        val = false;
      }
    }
    setComplete(val);
  }, [faq, ready]); // Add dependencies to useEffect

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
              <StatusSquare complete={false} />
            </Col>
          </Row>
        </Col>

      </Row>

      {chartReady ? (
        <Row className="justify-content-center py-5">
          <BarChartComponent data={chartData} />
        </Row>
      ) : <LoadingSpinner />}
    </Container>
  );
};

export default AdminPage;
