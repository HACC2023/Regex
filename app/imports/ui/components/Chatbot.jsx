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
  const [opacity, setOpacity] = useState(0);
  const [userLanguage, setUserLanguage] = useState('english');

  // Increases the freq attribute in the Askus database for selected item.
  const increaseFreq = (item, amount) => {
    const { _id } = item;
    const freq = item.freq + amount;
    AskUs.collection.update(_id, { $set: { freq } }, (error) => (error ?
      console.log('Error', error.message) :
      console.log(/* 'Success', `increased ${item.filename} freq by ${amount} (from ${item.freq} to ${freq})` */)));
  };

  const handleLanguageSelect = (e) => {
    setUserLanguage(e.target.value);
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

    // Record the start time just before making the Meteor call
    const timeStart = (new Date()).getTime();

    // Meteor.call is executed immediately here without the setTimeout
    Meteor.call('getChatbotResponse', userId, userInput, userLanguage, (error, result) => {
      setLoading(false);
      if (!error) {
        const newMessages = [
          { sender: 'user', text: userInput },
          { sender: 'bot', text: result.chatbotResponse },
        ];

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

        setChatHistory([...chatHistory, ...newMessages]);
        setSimilarArticles(result.similarArticles);
        setUserInput('');

        if (opacity < 100) {
          setOpacity(opacity + 1);
        }

        // Log the response time
        const timeEnd = (new Date()).getTime();
        const responseTimeMs = timeEnd - timeStart;
        console.log(`Response took ${responseTimeMs}ms, or ${responseTimeMs / 1000} seconds. (User Input: "${userInput}")`);

      } else {
        setChatHistory([...chatHistory, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
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
    if (message.link != null) {
      return ('');
    }
    return <div>ChatBot</div>;
  };

  // Fades in similar article cards when they are rendered
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (opacity < 100 && similarArticles[0]) {
        setOpacity((prevOpacity) => prevOpacity + 1);
      }
    }, 3);

    // Clears the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [opacity, similarArticles]);

  // Scrolls to bottom of chat window when chatHistory is updated
  const chat = useRef();
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-window');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
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
          <select value={userLanguage} onChange={handleLanguageSelect} className="mb-1">
            <option value="english">English</option>
            <option value="spanish">Español</option>
            <option value="japanese">日本語</option>
            <option value="chinese">中文</option>
            <option value="korean">한국어</option>

            {/* Add more languages as needed */}
          </select>
          <ChatWindow
            ref={chat}
            chatHistory={chatHistory}
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
        <SimilarArticles similarArticles={similarArticles} opacity={opacity / 100} />
      </Row>
    </Container>
  );
};

// Requires a string to be passed from rendering page
ChatBox.propTypes = {
  input: PropTypes.string.isRequired,
};

export default ChatBox;
