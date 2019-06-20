'use strict';

const stepMarker = require('../../../lib/step-marker');
const question = require('../../../modules/question');

class Updater {
  constructor({ flags, implementation }) {
    this._implementation = implementation;
    this._flags = flags;
  }

  async update(decisionResults) {
    const shouldUpdate = decisionResults.some(info => info.update);
    if(!shouldUpdate) {
      return;
    }

    await this._updateDependencies(decisionResults);

    await this._installPackages();

    const testResult = await this._runTest();

    if (await this._shouldRollback(testResult)) {
      await this._rollback();
    }

    console.table(decisionResults);
  }

  async _updateDependencies(decisionResults) {
    await this._implementation.updateDependencies(decisionResults);
  }

  async _installPackages() {
    if (!this._flags.install) {
      return;
    }

    stepMarker.installingPackages();
    this._implementation.installDependencies();
  }

  async _runTest() {
    if (!this._flags.test) {
      return true;
    }

    let isTestSucceeded = false;
    do {
      stepMarker.runningTests();
      isTestSucceeded = await this._implementation.testProject();
    } while (!isTestSucceeded && await question.shouldRunTestsAgain());

    return isTestSucceeded;
  }

  async _shouldRollback(testResult) {
    return !testResult && await question.shouldRollbackUpdate();
  }

  async _rollback() {
    await this._implementation.rollbackChanges();
    await this._installPackages();
  }
}

module.exports = ({ flags, implementation }) => {
  const updater = new Updater({ flags, implementation });

  return async (packages) => await updater.update(packages);
};
