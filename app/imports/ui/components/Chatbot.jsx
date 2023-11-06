import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col } from 'react-bootstrap';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SimilarArticles from './SimilarArticles';

const ChatBox = () => {
  // State variables for user input, chat history, loading state, and similar articles
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);

  // Reference to scroll to the end of the chat
  const chatEndRef = useRef(null);

  // Load chat history from localStorage when the component mounts
  useEffect(() => {
    const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    const savedSimilarArticles = JSON.parse(localStorage.getItem('similarArticles'));
    if (savedChatHistory) {
      setChatHistory(savedChatHistory);
    }
    if (savedSimilarArticles) {
      setSimilarArticles(savedSimilarArticles);
    }
  }, []);

  // Save chat history to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    localStorage.setItem('similarArticles', JSON.stringify(similarArticles));

  }, [chatHistory, similarArticles]);

  // Function to handle sending user messages
  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);

    const timeStart = (new Date()).getTime();

    const userId = 'placeholderUserId';

    Meteor.call('getChatbotResponse', userId, userInput, (error, result) => {
      setLoading(false);
      if (!error) {
        const newMessages = [
          { sender: 'user', text: userInput },
          { sender: 'bot', text: result.chatbotResponse },
        ];

        setChatHistory((prevChatHistory) => [...prevChatHistory, ...newMessages]);
        setSimilarArticles(result.similarArticles);
        setUserInput('');

        const timeEnd = (new Date()).getTime();
        const responseTimeMs = timeEnd - timeStart;
        console.log(`User Input: "${userInput}"`);
        console.log(`Request took ${responseTimeMs}ms, or ${responseTimeMs / 1000} seconds.`);
      } else {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' },
        ]);
        console.error('Error fetching chatbot response:', error);
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

  // Function to determine the sender of a message
  const chatSender = (message) => {
    if (message.sender === 'user') {
      return <div>You</div>;
    }
    if (message.link != null) {
      return ('');
    }
    return <div>ChatBot</div>;
  };

  // Effect to scroll to the end of the chat when it updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <ChatWindow
            chatHistory={chatHistory}
            chatSender={chatSender}
            formatChatbotResponse={formatChatbotResponse}
            loading={loading}
            chatEndRef={chatEndRef}
          />
          <ChatInput
            userInput={userInput}
            setUserInput={setUserInput}
            handleSend={handleSend}
            loading={loading}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <h5 className="mb-3">Relevant Articles</h5>
        <SimilarArticles similarArticles={similarArticles} />
      </Row>
    </Container>
  );
};

export default ChatBox;
