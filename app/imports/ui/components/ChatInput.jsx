import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

const ChatInput = React.forwardRef((props, ref) => {
  const { userInput, setUserInput, handleSend, loading } = props;

  return (
    <Form onSubmit={handleSend} ref={ref} className="mt-3">
      <div className="d-flex">
        <Form.Control
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          aria-label="User input" // Added for accessibility
        />
        <Button type="submit" className="ms-2" style={{ backgroundColor: '#907139' }}  disabled={loading}>Send</Button>
      </div>
    </Form>
  );
});

// Define prop types
ChatInput.propTypes = {
  userInput: PropTypes.string.isRequired,
  setUserInput: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ChatInput;
