import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff (Admin) table. See pages/FAQStatsAdmin.jsx. */
const StatItemAdmin = ({ page }) => (
  <tr>
    <td>{page.filename}</td>
    <td>{page.question}</td>
    <td>{page.freq}</td>
  </tr>
);

// Require a document to be passed to this component.
StatItemAdmin.propTypes = {
  page: PropTypes.shape({
    filename: PropTypes.string,
    question: PropTypes.string,
    freq: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default StatItemAdmin;
