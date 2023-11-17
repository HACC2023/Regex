import React from 'react';
import PropTypes from 'prop-types';

// CURRENTLY MUST REFRESH TO DISPLAY CHANGES
/** A square to display current status */
const StatusSquare = ({ complete }) => (
  complete ? <div className="square" style={{ backgroundColor: 'lightgreen' }}>&#x2713;</div> : <div className="square" style={{ backgroundColor: 'red' }}>X</div>
);

// Require a document to be passed to this component.
StatusSquare.propTypes = {
  complete: PropTypes.bool.isRequired,
};

export default StatusSquare;
