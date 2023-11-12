import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Renders a single card w/ information for FAQ */
const FAQCard = ({ article }) => {
  const text = `${article.article_text.substring(0, 200)}...`;

  return (
    <Card className="h-100">
      <Card.Header>
        <Card.Title style={{ textAlign: 'left' }}>
          <Link to={`/article_html/${article.filename}`} className="card-link" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>
            {article.question}
          </Link>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ textAlign: 'left' }}>
          { text }
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

// Require a document to be passed to this component.
FAQCard.propTypes = {
  article: PropTypes.shape({
    filename: PropTypes.string,
    question: PropTypes.string,
    article_text: PropTypes.string,
  }).isRequired,
};

export default FAQCard;
