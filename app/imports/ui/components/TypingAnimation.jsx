import React, { useState, useEffect } from 'react';

// !! Remove line below and add props when this function is final !!
// eslint-disable-next-line react/prop-types
const TypingAnimation = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setCurrentText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <span>{currentText}</span>;
};

export default TypingAnimation;
