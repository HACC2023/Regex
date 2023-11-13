import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { AskUs } from '../../api/askus/AskUs';
import { useChartData } from '../components/ChartDataHook';
import BarChartComponent from '../components/AdminBarChart';
import StatItemAdmin from '../components/StatItemAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
import EmbeddedButton from '../components/EmbeddedButton';
import UpdateDatabaseButton from '../components/AskUsCollectionUpdateButton';

/* Renders a table containing all of the Stuff documents. Use <StatItemAdmin> to render each row. */
const AdminPage = () => {
  const [complete, setComplete] = useState(false);

  // Fetch and prepare data for the table
  const { ready, pages } = useTracker(() => {
    const subscription = Meteor.subscribe(AskUs.userPublicationName);
    const items = AskUs.collection.find().fetch();
    return {
      pages: items,
      ready: subscription.ready(),
    };
  }, []);

  // Fetch and prepare data for the chart using useChartData hook
  const { chartData } = useChartData(); // Use the custom hook

  // Checks if embeddings (for top 8 freq articles) exist
  useEffect(() => {
    let val = true;
    for (let i = 0; i < pages.length; i++) {
      if (!ready || (ready && !pages[i].embedding)) {
        val = false;
      }
    }
    setComplete(val);
  }, [pages, ready]); // Add dependencies to useEffect

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <h2 className="text-center pb-3">Admin Stats</h2>
        <BarChartComponent data={chartData} />
      </Row>
      <Container>
        <p><a href="https://askuh.info">Home</a> &gt; Admin</p>
      </Container>
      <Row className="justify-content-center">
        <h2 className="text-center pb-3" style={{ textDecoration: 'underline' }}>Admin Stats</h2>

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
          <Row className="text-center g-0">
            <Col>
              <EmbeddedButton />
            </Col>
            <Col>
              {complete ? <div className="square" style={{ backgroundColor: 'lightgreen' }}>&#x2713;</div> : <div className="square" style={{ backgroundColor: 'red' }}>X</div>}
            </Col>
          </Row>
          <Row className="text-center g-0 mt-1" style={{ marginRight: '-1.4em' }}>
            <Col lg={5}>
              <UpdateDatabaseButton />
            </Col>
          </Row>
        </Col>

      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminPage;
