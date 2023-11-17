// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

/** Displays average response time */
const AdminGraph = () => {
  /* const [graphData, setGraphData] = useState([]]);

  useEffect(() => {
  Meteor.call('getGraphData', (error, result) => {
    if (error) {
      console.error('Error getting average response time:', error);
    } else {
      // console.log('Graph Data:', result);
    }
    setGraphData(result);
  }); */

  // replace this with meteor call once response time is logged in messages collection
  const graphData = [{ 1: 10 }, { 1: 79 }, { 1: 263 }];

  return (
    <div>SICK GRAPH HERE</div>
  );
};
export default AdminGraph;
