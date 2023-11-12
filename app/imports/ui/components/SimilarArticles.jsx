import React from 'react';
import { Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SimilarArticles = ({ similarArticles }) => (
  <>
    {similarArticles.slice(0, 3).map((article) => {
      const truncatedContent = `${article.article_text.substring(0, 500)}...`;
      return (
        <Col key={article._id} md={4}> {/* Ensure the key here is unique for each article */}
          <Card className="card mb-3, h-100">
            <Card.Body className="card-body">
              <Card.Title className="card-title">{article.question}</Card.Title>
              <Card.Text className="card-text">{truncatedContent}</Card.Text>
              <Link
                to={`/article_html/${article.filename}`}
                className="card-link"
                target="_blank"
                rel="noopener noreferrer"
              >Read full article
              </Link>
            </Card.Body>
          </Card>
        </Col>
      );
    })}

  </>
);

SimilarArticles.propTypes = {
  similarArticles: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    article_text: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
  })).isRequired,
};

export default SimilarArticles;
