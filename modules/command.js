'use strict';

const { execute, executeLive } = require('../lib/execute-command');

module.exports = {
  async outdatedPackages(projectFolder) {
    const outdated = await execute(`cd ${projectFolder} && npm outdated --json`);
    const packages = outdated.length > 0 ? JSON.parse(outdated) : {};

    return Object.entries(packages).map(([name, versions]) => {
      return { name, versions };
    });
  },

  async installPackages(projectFolder) {
    await executeLive(`cd ${projectFolder} && npm install`);
  },

  async runTest(projectFolder) {
    try {
      await executeLive(`cd ${projectFolder} && npm test`);
      return true;
    } catch(error) {
      return false;
    }
  }
};
