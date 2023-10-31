import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';

const ChatBox = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);
    setChatHistory([...chatHistory, { sender: 'user', text: userInput }]);

    Meteor.call('getChatbotResponse', userInput, (error, response) => {
      setLoading(false);
      if (!error) {
        setChatHistory([...chatHistory, { sender: 'user', text: userInput }, { sender: 'bot', text: response }]);
        setUserInput('');
      } else {
        setChatHistory([...chatHistory, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
      }
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="chat-window">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {loading && <Spinner animation="border" />}
          </div>
        </Col>
      </Row>
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
    </Container>
  );
};

export default ChatBox;
