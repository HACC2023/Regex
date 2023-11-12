import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ChatLoading from './ChatLoading';

const transition = {
  type: 'spring',
  stiffness: 200,
  mass: 0.2,
  damping: 20,
};

const variants = {
  initial: {
    opacity: 0,
    y: 300,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition,
  },
};

const ChatWindow = React.forwardRef((props, ref) => {
  // eslint-disable-next-line no-unused-vars
  const { chatHistory, chatSender, formatChatbotResponse, loading } = props;

  return (
    <div className="chat-window">
      <AnimatePresence>
        {chatHistory.map((message, index) => (
          <React.Fragment key={message.id || `message-${index}`}>
            <motion.div
              className={`d-flex ${message.sender === 'bot' ? 'justify-content-start px-2' : 'justify-content-end px-2'}`}
              initial="initial"
              animate="enter"
              variants={variants}
            > {chatSender(message)}
            </motion.div>
            <div className={`d-flex ${message.sender === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}>
              <motion.div
                className={`${message.sender === 'bot' ? 'bubble left' : 'bubble right'} chat-message ${message.sender}`}
                style={{ width: 'fit-content' }}
                initial="initial"
                animate="enter"
                variants={variants}
              >
                {message.sender === 'bot' ? formatChatbotResponse(message.text) : message.text}
              </motion.div>
            </div>
          </React.Fragment>
        ))}
      </AnimatePresence>
      {/* ChatLoading Circle is rendered here */}
      {loading && <ChatLoading />}
      <div ref={ref} />
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
