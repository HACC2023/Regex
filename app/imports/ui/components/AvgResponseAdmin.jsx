import React from 'react';
import { Card } from 'react-bootstrap';

// replace this with meteor call once response time is logged in messages collection
const resp = '2.59s';

/** Displays average response time */
const StatusSquare = () => (
  <Card className="text-center">
    <Card.Header>
      <h5>Average Response Time</h5>
    </Card.Header>
    <h2 className="my-4">{resp}</h2>
  </Card>
);
export default StatusSquare;
