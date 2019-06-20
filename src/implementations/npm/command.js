'use strict';

const { execute, executeLive, executeLiveWithResult } = require('../../../lib/execute-command');

module.exports = {
  async outdatedPackages(projectFolder) {
    return await execute('npm outdated --json', projectFolder);
  },
  async installPackages(projectFolder) {
    await executeLive('npm install', projectFolder);
  },

  async runTest(projectFolder) {
    return await executeLiveWithResult('npm test', projectFolder);
  }
};
