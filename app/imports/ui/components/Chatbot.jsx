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

    const timeStart = (new Date()).getTime();

    const userId = 'placeholderUserId';

    setTimeout(() => {
      Meteor.call('getChatbotResponse', userId, userInput, (error, result) => {
        setLoading(false);
        if (!error) {
          const newMessages = [
            { sender: 'user', text: userInput },
            { sender: 'bot', text: result.chatbotResponse }, // Ensure the chatbot's response includes the link if needed
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
    }, 1000);
  };

  // Function to format chatbot's response
  const formatChatbotResponse = (text) => {
    const lines = text.split('\n');
    const linkRegex = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
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
