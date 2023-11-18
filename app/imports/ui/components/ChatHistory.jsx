import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ChatHistory = ({ session, deleteSession }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate('/chatbot');
    console.log(`Current Session ID: ${session._id}`);
    sessionStorage.setItem('chatbotSessionId', session._id);
  };

  // Convert the date to a string
  const dateString = session.sentAt.toLocaleString();
  return (
    <Row
      className="mb-3 border p-1 "
      key={session._id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background: '#907139' }}
    >
      <Col
        onClick={handleRowClick}
        className={`${isHovered ? 'text-primary' : 'text-dark'}`}
      >
        <h5>{session.latestQuery}</h5>
        <p>{dateString}</p>
      </Col>
      <Col
        xs={1}
        className={`d-flex justify-content-center align-items-center ${isHovered ? 'text-primary' : 'text-dark'}`}
      >
        <Trash onClick={() => deleteSession(session._id)} />
      </Col>
    </Row>
  );
};

ChatHistory.propTypes = {
  session: PropTypes.shape({
    latestQuery: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
  deleteSession: PropTypes.func.isRequired,
};

export default ChatHistory;
