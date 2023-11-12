import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AskUs } from '../../api/askus/AskUs';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SimilarArticles from './SimilarArticles';
import { Messages } from '../../api/messages/Messages';
import { useTracker } from 'meteor/react-meteor-data';

/*
const formSchema = new SimpleSchema({
    sender: PropTypes.string,
    message: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
});

const bridge = new SimpleSchema2Bridge(formSchema);
*/

const ChatBox = (props) => {
  const { input } = props;
  const [userInput, setUserInput] = useState(input);
  const [loading, setLoading] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);

  // Increases the freq attribute in the Askus database for selected item.
  const increaseFreq = (item, amount) => {
    const { _id } = item;
    const freq = item.freq + amount;
    AskUs.collection.update(_id, { $set: { freq } }, (error) => (error ?
      console.log('Error', error.message) :
      console.log(/* 'Success', `increased ${item.filename} freq by ${amount} (from ${item.freq} to ${freq})` */)));
  };

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = 'placeholderUserId'; // Placeholder, replace with actual userId if available
    if (typeof userInput !== 'string' || !userInput.trim()) {
      // Handle the case when userInput is empty or just whitespace
      setLoading(false);
      console.error('User input is empty.');
      return; // Exit early to prevent calling the method with an empty message
    }

    let sentAt = new Date();
    Messages.collection.insert(
      { sender: 'user', message: userInput, sentAt: sentAt }
    );
    // Record the start time just before making the Meteor call
    const timeStart = (new Date()).getTime();

    // Meteor.call is executed immediately here without the setTimeout
    Meteor.call('getChatbotResponse', userId, userInput, (error, result) => {
      setLoading(false);
      if (!error) {

        // Update the frequency of similar articles
        if (result.similarArticles[0]) {
          increaseFreq(result.similarArticles[0], 1);
        }
        for (let i = 1; i < 3; i++) {
          if (result.similarArticles[i]) {
            const runnerUpArticle = result.similarArticles[i];
            increaseFreq(runnerUpArticle, 0.5);
          }
        }

        sentAt = new Date();
        Messages.collection.insert(
           { sender: 'bot', message: result.chatbotResponse, sentAt: sentAt }
        );
        setSimilarArticles(result.similarArticles);
        setUserInput('');

        // Log the response time
        const timeEnd = (new Date()).getTime();
        const responseTimeMs = timeEnd - timeStart;
        console.log(`Response took ${responseTimeMs}ms, or ${responseTimeMs / 1000} seconds. (User Input: "${userInput}")`);

      } else {
        sentAt = new Date();
        Messages.collection.insert(
           { sender: 'bot', message: 'Sorry, I encountered an error. Please try again later.', sentAt: sentAt }
        );
        console.error(`Response failed. (User Input: "${userInput}")`);
      }
    });
  };
  // Function to format chatbot's response
  const formatChatbotResponse = (text) => {
    const lines = text.split('\n');
    const linkRegex = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&;/~+#])?/;
    const formattedLines = lines.map((line, index) => {
      const linkMatch = line.match(linkRegex);
      if (linkMatch) {
        const link = linkMatch[0];
        const linkText = line.replace(link, '').trim() || 'Link';
        return (
          <p key={index}>
            {linkText}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </p>
        );
      }
      return <p key={index}>{line}</p>;
    });
    return <div>{formattedLines}</div>;
  };

  // Helper function that provides message sender above messages that aren't chatbot links.
  const chatSender = (message) => {
    if (message.sender === 'user') {
      return <div>You</div>;
    }
    /*
    if (message.link != null) {
      return ('');
    }
    */
    return <div>ChatBot</div>;
  };

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
  // Scrolls to bottom of chat window when chatHistory is updated

  const chat = useRef();
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-window');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Autosubmits the form if starting input is not empty (ie redirected from landing)
  const form = useRef();
  useEffect(() => {
    // console.log(input);
    // alert('handle submit');
    if (input !== '') {
      form.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
    }
  },[]);

  return (
    <Container className="mt-5">
      <Row>
        {/* Chatbot Conversation Column */}
        <Col>
          <ChatWindow
            ref={chat}
            chatSender={chatSender}
            formatChatbotResponse={formatChatbotResponse}
            loading={loading}
          />
          <ChatInput
            ref={form}
            userInput={userInput}
            setUserInput={setUserInput}
            handleSend={handleSend}
            loading={loading}
          />
        </Col>
      </Row>
      {/* Similar articles cards */}
      <Row className="mt-5">
        <h5 className="mb-3">Relevant Articles</h5>
        <SimilarArticles similarArticles={similarArticles} />
      </Row>
    </Container>
  );
};

// Requires a string to be passed from rendering page
ChatBox.propTypes = {
  input: PropTypes.string.isRequired,
};

export default ChatBox;
