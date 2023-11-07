// findMostSimilarArticles.tests.js
import { expect } from 'chai';
import sinon from 'sinon';
import { Askus } from '../../api/askus/Askus.js';
import { describe, it, before, afterEach } from 'mocha';
import { findMostSimilarArticles } from '/path-to-your-function';

describe('findMostSimilarArticles', () => {
  let sandbox;
  let articles;

  before(() => {
    sandbox = sinon.createSandbox();
    articles = [
      { _id: '1', embedding: [1, 2, 3], article_text: 'Article 1' },
      { _id: '2', embedding: [4, 5, 6], article_text: 'Article 2' },
      { _id: '3', embedding: [7, 8, 9], article_text: 'Article 3' },
    ];
    sandbox.stub(Askus.collection, 'find').returns({
      fetch: () => articles,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('finds and returns the most similar articles based on the embedding', () => {
    const userEmbedding = [4, 5, 6];
    const similarArticles = findMostSimilarArticles(userEmbedding);

    expect(similarArticles).to.have.lengthOf(3);
    expect(similarArticles[0]._id).to.equal('2'); // The most similar article should be the second one
  });
});
