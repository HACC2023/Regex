import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';

const ChatBox = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);
    setChatHistory([...chatHistory, { sender: 'user', text: userInput }]);

    Meteor.call('getChatbotResponse', userInput, (error, result) => {
      setLoading(false);
      if (!error) {
        setChatHistory([...chatHistory, { sender: 'user', text: userInput }, { sender: 'bot', text: result.chatbotResponse }]);
        setSimilarArticles(result.similarArticles);
        setUserInput('');
      } else {
        setChatHistory([...chatHistory, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
      }
      // console.log('Received from server:', result); // comment this line when done testing

    });
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Chatbot Conversation Column */}
        <Col md={8}>
          <div className="chat-window">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {loading && <Spinner animation="border" />}
          </div>
          <Row className="mt-3">
            <Col>
              <Form onSubmit={handleSend}>
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
        </Col>

        {/* Similar Articles Column */}
        <Col md={4}>
          <h5>Similar Articles</h5>
          {similarArticles.map((article, index) => {
            // Truncating the article content to 200 characters for the excerpt
            const truncatedContent = `${article.article_text.substring(0, 200)}...`;

            return (
              <div key={index} className="card mb-3" style={{ width: '18rem' }}>
                <div className="card-body">
                  <h5 className="card-title">{article.question}</h5>
                  <p className="card-text">{truncatedContent}</p>
                  <a href={`/article_html/${article.filename}`} className="card-link" target="_blank" rel="noopener noreferrer">Read full article</a>
                </div>
              </div>
            );
          })}
        </Col>

      </Row>
    </Container>
  );
};

export default ChatBox;
