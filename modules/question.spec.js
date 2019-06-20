'use strict';

const question = require('./question');
const { mockPromptResponse, stubPromptToggle } = require('../test-config/test-helper/test-helper');

describe('Question', () => {
  const name = 'my-package-name';

  describe('#shouldUpdatePackage', () => {
    it('should return with a boolean for the given name', async () => {
      mockPromptResponse({ id: name, result: true });

      const response = await question.shouldUpdatePackage({ name, versions: {} });

      expect(response).to.deep.equal({ [name]: true });
    });

    it('should contain the package name and versions in the question', async () => {
      const promptToggle = stubPromptToggle();
      const versions = { current: '3.2.1', latest: '4.3.2' };

      await question.shouldUpdatePackage({ name, versions });

      const firstCall = promptToggle.getCall(0);
      const [{ message: promptQuestion }] = firstCall.args;

      expect(promptQuestion).to.contains(name);
      expect(promptQuestion).to.contains(versions.current);
      expect(promptQuestion).to.contains(versions.latest);
    });
  });

  describe('#shouldRollbackUpdate', () => {
    it('should return with the prompt result', async () => {
      const promptResponse = mockPromptResponse({ id: 'rollback' });

      const response = await question.shouldRollbackUpdate();

      expect(response).to.deep.equal(promptResponse);
    });
  });

  describe('#shouldRunTestsAgain', () => {
    it('should return with the prompt result', async () => {
      const promptResponse = mockPromptResponse({ id: 'test' });

      const response = await question.shouldRunTestsAgain();

      expect(response).to.deep.equal(promptResponse);
    });
  });
});
