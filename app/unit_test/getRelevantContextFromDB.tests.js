// getRelevantContextFromDB.tests.js
import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it, before, afterEach } from 'mocha';
import { getRelevantContextFromDB } from '/path-to-your-function';

describe('getRelevantContextFromDB', () => {
  let sandbox;
  let findMostSimilarArticlesStub;

  before(() => {
    sandbox = sinon.createSandbox();
    findMostSimilarArticlesStub = sandbox.stub().returns([
      { _id: '1', embedding: [1, 2, 3], article_text: 'Article 1', filename: 'file1', question: 'Question 1' },
      { _id: '2', embedding: [4, 5, 6], article_text: 'Article 2', filename: 'file2', question: 'Question 2' },
    ]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('gets the relevant context from the database based on the user\'s embedding', () => {
    const userEmbedding = [4, 5, 6];
    const context = getRelevantContextFromDB(userEmbedding);

    expect(context.messagesForChatbot).to.have.lengthOf(2);
    expect(context.articlesForComponent).to.have.lengthOf(2);
    expect(context.articlesForComponent[0].filename).to.equal('file1');
    expect(context.articlesForComponent[1].filename).to.equal('file2');
  });
});
