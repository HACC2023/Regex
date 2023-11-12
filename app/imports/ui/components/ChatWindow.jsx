import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ChatLoading from './ChatLoading';
import { useTracker } from 'meteor/react-meteor-data';
import {Messages} from "../../api/messages/Messages";

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


    const { ready, messages } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Messages.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Message documents
    const messageItems = Messages.collection.find({}).fetch();
    return {
      messages: messageItems,
      ready: rdy,
    };
    }, []);
  // eslint-disable-next-line no-unused-vars
  const { chatSender, formatChatbotResponse, loading } = props;

  return ( ready ? (
    <div className="chat-window">
      <AnimatePresence>
        {messages.map(message => (
          <React.Fragment key={message._id}>
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
                {message.sender === 'bot' ? formatChatbotResponse(message.message) : message.message}
              </motion.div>
            </div>
          </React.Fragment>
        ))}
      </AnimatePresence>
      {/* ChatLoading Circle is rendered here */}
      {loading && <ChatLoading />}
      <div ref={ref} />
    </div>
  ) : 'notReady');
});

ChatWindow.propTypes = {
  chatSender: PropTypes.func.isRequired, // For chatSender function
  formatChatbotResponse: PropTypes.func.isRequired, // For formatChatbotResponse function
  loading: PropTypes.bool.isRequired, // For loading state
};

export default ChatWindow;
