import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';

const ChatBox = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);

  const chatEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);
    setChatHistory([...chatHistory, { sender: 'user', text: userInput }]);

    // Simulate chatbot typing effect
    setTimeout(() => {
      Meteor.call('getChatbotResponse', userInput, (error, result) => {
        setLoading(false);
        if (!error) {
          const newMessages = [
            { sender: 'user', text: userInput },
            { sender: 'bot', text: result.chatbotResponse },
          ];

          // Check if similarArticles is available and non-empty
          if (result.similarArticles && result.similarArticles.length > 0) {
            const mostRelevantArticle = result.similarArticles[0];
            const articleMessage = {
              sender: 'bot',
              text: `Here is the most relevant article link: [${mostRelevantArticle.question}](/article_html/${mostRelevantArticle.filename})`,
            };
            newMessages.push(articleMessage);
          }

          setChatHistory([...chatHistory, ...newMessages]);
          setSimilarArticles(result.similarArticles);
          setUserInput('');
        } else {
          setChatHistory([...chatHistory, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
        }
      });
    }, 1000); // simulate a 1-second delay for the typing effect
  };


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
              <div key={index} className={`chat-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {loading && <div><Spinner animation="border" /> <span>typing...</span></div>}
            <div ref={chatEndRef} />
          </div>
          <Form onSubmit={handleSend} className="mt-3">
            <Form.Control
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask something..."
            />
            <Button type="submit" className="mt-2">Send</Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-5">
        <h5 className="mb-3">Similar Articles</h5>
        {similarArticles.slice(0, 3).map((article, index) => {
          // Truncating the article content to 200 characters for the excerpt
          const truncatedContent = `${article.article_text.substring(0, 200)}...`;

          return (
            <Col key={index} md={4}>
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
