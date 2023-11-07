import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AskUs } from '../../api/askus/AskUs';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SimilarArticles from './SimilarArticles';

const ChatBox = (props) => {
  const { input } = props;
  const [userInput, setUserInput] = useState(input);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);

  const chatEndRef = useRef(null);

  const timeStart = (new Date()).getTime();

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
    setChatHistory([...chatHistory, { sender: 'user', text: userInput }]);

    const userId = 'placeholderUserId'; // Placeholder, replace with actual userId if available
    if (!userInput.trim()) {
      // Handle the case when userInput is empty or just whitespace
      setLoading(false);
      console.error('User input is empty.');
      return; // Exit early to prevent calling the method with an empty message
    }
    // Simulate chatbot typing effect
    setTimeout(() => {
      Meteor.call('getChatbotResponse', userId, userInput, (error, result) => {
        setLoading(false);
        if (!error) {
          const newMessages = [
            { sender: 'user', text: userInput },
            { sender: 'bot', text: result.chatbotResponse },
          ];

          if (result.similarArticles[0]) {
            increaseFreq(result.similarArticles[0], 1);
          }
          for (let i = 1; i < 3; i++) {
            if (result.similarArticles[i]) {
              const runnerUpArticle = result.similarArticles[i];
              increaseFreq(runnerUpArticle, 0.5);
            }
          }

          setChatHistory([...chatHistory, ...newMessages]);
          setSimilarArticles(result.similarArticles);
          setUserInput('');

          const timeEnd = (new Date()).getTime();
          const responseTimeMs = timeEnd - timeStart;
          console.log(`Response took ${responseTimeMs}ms, or ${responseTimeMs / 1000} seconds. (User Input: "${userInput}")`);

        } else {
          setChatHistory([...chatHistory, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
          console.log(`Response failed. (User Input: "${userInput}")`);
        }
      });
    }, 0); // simulate a 1-second delay for the typing effect (changed from 1000 (1s) to 0 so there's no extra delay)
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
    if (message.link != null) {
      return ('');
    }
    return <div>ChatBot</div>;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        {/* Chatbot Conversation Column */}
        <Col>
          <ChatWindow
            chatHistory={chatHistory}
            chatSender={chatSender}
            formatChatbotResponse={formatChatbotResponse}
            loading={loading}
            chatEndRef={chatEndRef}
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
