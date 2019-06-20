'use strict';
const createUpdater = require('./updater.js');
const { createImplementationMock, stubPromptToggle, mockPromptResponse } = require('../../../test-config/test-helper/test-helper');
const { outdatedPackageWithUpdate } = require('../../../test-config/test-helper/data-factory');
const stepMarker = require('../../../lib/step-marker');

describe('Updater', () => {
  const decisionResultsWithUpdate = (update = true) => {
    return [
      outdatedPackageWithUpdate({ update })
    ];
  };

  beforeEach(() => {
    sinonSandbox.stub(stepMarker);
    sinonSandbox.stub(console, 'table');
  });

  describe('update step', () => {
    it('should not update dependencies if there is no package to update', async () => {
      const implementation = createImplementationMock();
      const update = createUpdater({ flags: {}, implementation });

      await update(decisionResultsWithUpdate(false));

      expect(implementation.updateDependencies).to.not.have.been.called;
    });

    it('should update dependencies if there is package that need to be updated', async () => {
      const implementation = createImplementationMock();
      const decisionResults = decisionResultsWithUpdate();
      const update = createUpdater({ flags: {}, implementation });

      await update(decisionResults);

      expect(implementation.updateDependencies).to.have.been.calledWithExactly(decisionResults);
    });
  });

  describe('install step', () => {
    it('should install packages if install flag is on after dependencies updated', async () => {
      const implementation = createImplementationMock();
      const update = createUpdater({ flags: { install: true }, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.installDependencies)
        .to.have.been.calledAfter(implementation.updateDependencies);
    });

    it('should not install packages if install flag is off and dependencies updated', async () => {
      const implementation = createImplementationMock();
      const update = createUpdater({ flags: { install: false }, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.installDependencies).to.not.have.been.called;
    });
  });

  describe('test step', () => {
    it('should run test after installed the packages if update and test flag is on', async () => {
      const implementation = createImplementationMock();
      const flags = { install: true, test: true };
      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.testProject)
        .to.have.been.calledAfter(implementation.installDependencies);
    });

    it('should not run test if test flag is off and update flag is on', async () => {
      const implementation = createImplementationMock();
      const flags = { install: true, test: false };
      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.testProject).to.not.have.been.called;
    });

    it('should ask question from user to rerun tests till it is failing', async () => {
      const prompt = stubPromptToggle(true);
      const implementation = createImplementationMock();
      const flags = { install: true, test: true };

      implementation.testProject
        .onFirstCall().resolves(false)
        .onSecondCall().resolves(false);

      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.testProject).to.have.been.calledThrice;
      expect(prompt).to.have.been.calledTwice;
    });

    it('should not rerun tests if it fails and user decide to not continue', async () => {
      mockPromptResponse({ id: 'test', result: false });
      mockPromptResponse({ id: 'rollback', result: false });

      const implementation = createImplementationMock();
      const flags = { install: true, test: true };

      implementation.testProject.resolves(false);

      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.testProject).to.have.been.calledOnce;
    });
  });

  describe('rollback step', () => {
    it('should not try to rollback if test passed', async () => {
      const implementation = createImplementationMock();
      const flags = { install: true, test: true };

      implementation.testProject.resolves(true);

      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.rollbackChanges).to.not.have.been.called;
    });

    it('should only rollback if test failed and user decided to do it', async () => {
      mockPromptResponse({ id: 'test', result: false });
      mockPromptResponse({ id: 'rollback', result: true });

      const implementation = createImplementationMock();
      implementation.testProject.resolves(false);

      const flags = { install: true, test: true };

      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.rollbackChanges).to.have.been.calledOnce;
    });

    it('should not rollback if test failed and user decided to not do that', async () => {
      mockPromptResponse({ id: 'test', result: false });
      mockPromptResponse({ id: 'rollback', result: false });

      const implementation = createImplementationMock();
      const flags = { install: true, test: true };

      implementation.testProject.resolves(false);

      const update = createUpdater({ flags, implementation });

      await update(decisionResultsWithUpdate());

      expect(implementation.rollbackChanges).to.not.have.been.called;
    });
  });
});
