import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

const ChatInput = ({ userInput, setUserInput, handleSend, loading }) => (
  <Form onSubmit={handleSend} className="mt-3">
    <div className="d-flex">
      <Form.Control
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask something..."
        aria-label="User input" // Added for accessibility
      />
      <Button type="submit" className="ms-2" disabled={loading}>Send</Button>
    </div>
  </Form>
);

// Define prop types
ChatInput.propTypes = {
  userInput: PropTypes.string.isRequired,
  setUserInput: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ChatInput;
