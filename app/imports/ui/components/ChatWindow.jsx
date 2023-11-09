import React from 'react';
import PropTypes from 'prop-types';
import ChatLoading from './ChatLoading';
// import TypingAnimation from './TypingAnimation';

const ChatWindow = React.forwardRef((props, ref) => {
  const { chatHistory, chatSender, formatChatbotResponse, loading } = props;

  return (
    <div className="chat-window" ref={ref}>
      {chatHistory.map((message, index) => (
        <React.Fragment key={message.id || `message-${index}`}>
          <div className={`d-flex ${message.sender === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}> {chatSender(message)} </div>
          <div className={`d-flex ${message.sender === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}>
            <div className={`${message.sender === 'bot' ? 'bubble left' : 'bubble right'} chat-message ${message.sender}`} style={{ width: 'fit-content' }}>
              {message.sender === 'bot' ? formatChatbotResponse(message.text) : message.text}
            </div>
          </div>
        </React.Fragment>
      ))}
      {/* ChatLoading Circle is rendered here */}
      {loading && <ChatLoading />}
      <div />
    </div>
  );
});

ChatWindow.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // or number, depending on what you use
      sender: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  chatSender: PropTypes.func.isRequired, // For chatSender function
  formatChatbotResponse: PropTypes.func.isRequired, // For formatChatbotResponse function
  loading: PropTypes.bool.isRequired, // For loading state
};

export default ChatWindow;
