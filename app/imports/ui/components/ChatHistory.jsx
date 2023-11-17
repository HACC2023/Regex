import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the FAQStats (Admin) table. See pages/AdminPage.jsx. */
const ChatHistory = ({ session }) => (
  <tr>
    <td>{session.latestQuery}</td>
    <td>{session.sentAt}</td>
  </tr>
);

// Require a document to be passed to this component.
ChatHistory.propTypes = {
  session: PropTypes.shape({
    latestQuery: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
};

export default ChatHistory;
