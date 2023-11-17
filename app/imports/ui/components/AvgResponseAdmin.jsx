// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

/** Displays average response time */
const AvgResponseAdmin = () => {
  /* const [respTime, setRespTime] = useState(0);

  useEffect(() => {
  Meteor.call('getAvgRespTime', (error, result) => {
    if (error) {
      console.error('Error getting average response time:', error);
    } else {
      // console.log('Average Response Time:', result);
    }
    setRespTime(result);
  }); */

  // replace this with meteor call once response time is logged in messages collection
  const respTime = '2.59s';

  return (
    <Card className="text-center">
      <Card.Header>
        <h5>Average Response Time</h5>
      </Card.Header>
      <h2 className="my-4">{respTime}</h2>
    </Card>
  );
};
export default AvgResponseAdmin;
