import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ChatLoading from './ChatLoading';
import { AskUs } from '../../api/askus/AskUs';

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
      console.log(/* 'Success', `increased ${filename} freq by ${amount}` */)));
  };

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
            const articleLink = (
              <a
                href={`/article_html/${mostRelevantArticle.filename}`}
                target="_blank"
                rel="noreferrer"
                className="chat-message bot"
              >
                {mostRelevantArticle.question}
              </a>
            );
            const articleMessage = {
              sender: 'bot',
              text: 'Here is the most relevant article link:',
              link: articleLink,
            };
            increaseFreq(mostRelevantArticle, 1);
            newMessages.push(articleMessage);
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
          <div className="chat-window">
            {chatHistory.map((message, index) => (
              <>
                {chatSender(message)}
                <div key={index} className={`chat-message ${message.sender}`}>
                  {message.text} {message.link}
                </div>
              </>
            ))}
            {/* ChatLoading Circle is rendered here */}
            {loading && <ChatLoading />}
            <div ref={chatEndRef} />
          </div>
          {/* Input and submit */}
          <Form onSubmit={handleSend} ref={form} className="mt-3">
            <div className="d-flex">
              <Form.Control
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask something..."
              />
              <Button type="submit" className="ms-2" disabled={loading}>Send</Button>
            </div>
          </Form>
        </Col>
      </Row>
      {/* Similar articles cards */}
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

// Requires a string to be passed from rendering page
ChatBox.propTypes = {
  input: PropTypes.string.isRequired,
};

export default ChatBox;
