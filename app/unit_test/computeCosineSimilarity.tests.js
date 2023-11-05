// computeCosineSimilarity.tests.js
import { expect } from 'chai';
import { computeCosineSimilarity } from '/path-to-your-function';
import { describe, it } from 'mocha';

describe('computeCosineSimilarity', function () {
  it('computes cosine similarity correctly for valid inputs', function () {
    const embedding1 = [1, 2, 3];
    const embedding2 = [4, 5, 6];
    const expectedSimilarity = 0.9746318461970762; // Replace with the expected value
    const similarity = computeCosineSimilarity(embedding1, embedding2);
    expect(similarity).to.equal(expectedSimilarity);
  });

  it('throws an error if inputs are not arrays', function () {
    expect(() => computeCosineSimilarity(null, [1, 2, 3])).to.throw('Both embeddings must be arrays.');
    expect(() => computeCosineSimilarity([1, 2, 3], null)).to.throw('Both embeddings must be arrays.');
  });

  it('throws an error if arrays have different lengths', function () {
    expect(() => computeCosineSimilarity([1, 2, 3], [1, 2])).to.throw('Embeddings must have the same length.');
  });
});
