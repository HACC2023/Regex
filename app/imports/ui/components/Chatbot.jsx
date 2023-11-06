import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import ChatLoading from './ChatLoading';

/**
 * The ChatBox component provides a chat interface where users can interact with a chatbot and receive responses.
 * It also displays a list of similar articles related to the conversation.
 */
const ChatBox = () => {
  // State variables for user input, chat history, loading state, and similar articles
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);

  // Reference to scroll to the end of the chat
  const chatEndRef = useRef(null);

  // Function to handle sending user messages
  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);

    const timeStart = (new Date()).getTime(); // Moved inside the function to measure response time for each input

    // Placeholder user ID - replace this with the actual user ID
    const userId = 'placeholderUserId';

    // Simulate chatbot typing effect (with a non-zero delay for actual simulation)
    setTimeout(() => {
      Meteor.call('getChatbotResponse', userId, userInput, (error, result) => {
        setLoading(false);
        if (!error) {
          const newMessages = [
            { sender: 'user', text: userInput }, // Keep this as it is added after the response is received
            { sender: 'bot', text: result.chatbotResponse },
          ];

          // Use functional update form for state updates
          setChatHistory(prevChatHistory => [...prevChatHistory, ...newMessages]);
          setSimilarArticles(result.similarArticles);
          setUserInput('');

          const timeEnd = (new Date()).getTime();
          const responseTimeMs = timeEnd - timeStart;
          console.log(`User Input: "${userInput}"`);
          console.log(`Request took ${responseTimeMs}ms, or ${responseTimeMs / 1000} seconds.`);

        } else {
          // Error handling for failed chatbot response
          setChatHistory(prevChatHistory => [...prevChatHistory, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
          console.error('Error fetching chatbot response:', error);
        }
      });
    }, 1000); // Changed to 1-second delay for typing effect simulation
  };

  // Function to format chatbot's response
  // Function to format chatbot's response
  const formatChatbotResponse = (text) => {
    // Check for various list markers and split the text into list items
    const listMarkersRegex = /(\d+\.)|(\* )|(- )|(Step \d+:)|(Note:)/;
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      if (listMarkersRegex.test(line)) {
        return (
          <li key={index} className="list-item">
            {line}
          </li>
        );
      }
      return (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      );
    });

    return <ul className="chat-list">{formattedLines}</ul>;
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
        {/* Chatbot Conversation Column */}
        <Col>
          <div className="chat-window">
            {chatHistory.map((message, index) => (
              <React.Fragment key={message.id || `message-${index}`}>
                {chatSender(message)}
                <div className={`chat-message ${message.sender}`}>
                  {message.sender === 'bot' ? formatChatbotResponse(message.text) : message.text}
                </div>
              </React.Fragment>
            ))}
            {/* ChatLoading Circle is rendered here */}
            {loading && <ChatLoading />}
            <div ref={chatEndRef} />
          </div>
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
        </Col>
      </Row>
      <Row className="mt-5">
        <h5 className="mb-3">Relevant Articles</h5>
        {similarArticles.slice(0, 3).map((article) => {
          // Truncating the article content to a longer length for the excerpt
          const truncatedContent = `${article.article_text.substring(0, 500)}...`;

          return (
            <Col key={article.id} md={4}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{article.question}</h5>
                  <p className="card-text">{truncatedContent}</p>
                  <a href={`/article_html/${article.filename}`} className="card-link" target="_blank" rel="noopener noreferrer">Read full article</a>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default ChatBox;
