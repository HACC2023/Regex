// getChatbotResponse.tests.js
import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it, before, afterEach } from 'mocha';
import { getChatbotResponse } from '/path-to-your-method';

describe('getChatbotResponse', () => {
  let sandbox;
  let getEmbeddingFromOpenAIStub;
  let getRelevantContextFromDBStub;
  let createOpenAICompletionStub;

  before(() => {
    sandbox = sinon.createSandbox();
    getEmbeddingFromOpenAIStub = sandbox.stub().resolves([1, 2, 3]);
    getRelevantContextFromDBStub = sandbox.stub().returns({
      messagesForChatbot: [],
      articlesForComponent: [],
    });
    createOpenAICompletionStub = sandbox.stub().resolves('Chatbot response');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns the chatbot response and similar articles', async () => {
    const userMessage = 'Hello, world!';
    const response = await getChatbotResponse(userMessage);

    expect(response.chatbotResponse).to.equal('Chatbot response');
    expect(response.similarArticles).to.be.an('array');
  });
});
