/**
 * Estimates the number of tokens in a given text based on character count.
 * Approximation: 1 token for every 4 characters in English.
 * @param {string} text - The text to estimate tokens for.
 * @returns {number} - The estimated number of tokens.
 */
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

// Usage example
const text = 'This is a test sentence.';
const estimatedTokens = estimateTokenCount(text);
console.log(`Estimated number of tokens: ${estimatedTokens}`);
