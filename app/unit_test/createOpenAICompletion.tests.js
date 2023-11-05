// createOpenAICompletion.tests.js
import { expect } from 'chai';
import sinon from 'sinon';
import OpenAI from 'openai';
import { describe, it, before, afterEach } from 'mocha';
import { createOpenAICompletion } from '/path-to-your-function';

describe('createOpenAICompletion', () => {
  let sandbox;
  let openaiStub;

  before(() => {
    sandbox = sinon.createSandbox();
    openaiStub = sandbox.stub(OpenAI.prototype, 'chat');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('creates a completion and returns the chatbot response', async () => {
    const messages = [{ role: 'user', content: 'Hello, world!' }];
    const fakeResponse = {
      choices: [{ message: { content: 'Hello there!' } }],
    };
    openaiStub.completions.create.resolves(fakeResponse);

    const response = await createOpenAICompletion(messages);
    expect(response).to.equal('Hello there!');
  });

  it('throws the expected error if the OpenAI API call fails', async () => {
    const messages = [{ role: 'user', content: 'Hello, world!' }];
    openaiStub.completions.create.rejects(new Error('API call failed'));

    await expect(createOpenAICompletion(messages)).to.be.rejectedWith('Failed to get a response from the chatbot: API call failed');
  });

  it('throws the expected error if the response format is unexpected', async () => {
    const messages = [{ role: 'user', content: 'Hello, world!' }];
    const fakeResponse = {}; // Invalid response
    openaiStub.completions.create.resolves(fakeResponse);

    await expect(createOpenAICompletion(messages)).to.be.rejectedWith('Unexpected OpenAI API response format');
  });
});
