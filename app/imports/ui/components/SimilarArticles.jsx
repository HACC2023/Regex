import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SimilarArticles = ({ similarArticles }) => (
  <>
    {similarArticles.slice(0, 3).map((article) => {
      const truncatedContent = `${article.article_text.substring(0, 500)}...`;
      return (
        <Col key={article._id} md={4}> {/* Ensure the key here is unique for each article */}
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
