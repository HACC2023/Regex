// getEmbeddingFromOpenAI.tests.js
import { expect } from 'chai';
import sinon from 'sinon';
import OpenAI from 'openai';
import { describe, it, before, afterEach } from 'mocha';
import { getEmbeddingFromOpenAI } from '/path-to-your-function';

describe('getEmbeddingFromOpenAI', () => {
  let sandbox;
  let openaiStub;

  before(() => {
    sandbox = sinon.createSandbox();
    openaiStub = sandbox.stub(OpenAI.prototype, 'embeddings');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns the correct embedding for a given text', async () => {
    const text = 'Hello, world!';
    const fakeResponse = {
      data: [
        { embedding: [1, 2, 3] },
      ],
    };
    openaiStub.create.resolves(fakeResponse);

    const embedding = await getEmbeddingFromOpenAI(text);
    expect(embedding).to.deep.equal([1, 2, 3]);
  });

  it('throws the expected error if the OpenAI API call fails', async () => {
    const text = 'Hello, world!';
    openaiStub.create.rejects(new Error('API call failed'));

    await expect(getEmbeddingFromOpenAI(text)).to.be.rejectedWith('Failed to fetch embedding from OpenAI: API call failed');
  });

  it('throws the expected error if the response format is unexpected', async () => {
    const text = 'Hello, world!';
    const fakeResponse = {}; // Invalid response
    openaiStub.create.resolves(fakeResponse);

    await expect(getEmbeddingFromOpenAI(text)).to.be.rejectedWith('Unexpected OpenAI API response format');
  });
});
