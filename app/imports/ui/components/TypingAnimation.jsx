import React, { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const TypingAnimation = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      // eslint-disable-next-line react/prop-types
      setCurrentText(text.slice(0, i));
      i++;
      // eslint-disable-next-line react/prop-types
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <span>{currentText}</span>;
};

export default TypingAnimation;
