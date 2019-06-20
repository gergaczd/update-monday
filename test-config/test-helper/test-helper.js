'use strict';

const prompts = require('prompts');

module.exports = {
  mockPromptResponse({ id, result = sinon.stub() } = {}) {
    prompts.inject({ [id]: result });
    return result;
  },

  stubPromptToggle(response = true) {
    const stub = sinonSandbox.stub(prompts.prompts, 'toggle');
    stub.resolves(response);
    return stub;
  },

  createImplementationMock() {
    return {
      getOutdatedPackages: sinon.stub().resolves([]),
      collectChangelog: sinon.stub(),
      updateDependencies: sinon.stub(),
      installDependencies: sinon.stub(),
      rollbackChanges: sinon.stub(),
      testProject: sinon.stub().resolves(true)
    };
  }
};
