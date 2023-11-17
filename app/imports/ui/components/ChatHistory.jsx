import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ChatHistory = ({ session }) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate('/chatbot');
    console.log(`Session ID Retrieved: ${session._id}`);
    sessionStorage.setItem('chatbotSessionId', session._id);
  };

  // Convert the date to a string
  const dateString = session.sentAt.toLocaleString();

  return (
    <tr onClick={handleRowClick}>
      <td>{session.latestQuery}</td>
      <td>{dateString}</td>
    </tr>
  );
};

// Require a document to be passed to this component.
ChatHistory.propTypes = {
  session: PropTypes.shape({
    latestQuery: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
};

export default ChatHistory;
