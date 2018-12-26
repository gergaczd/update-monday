'use strict';

const { execute, executeLive } = require('../lib/execute-command');

module.exports = {
  async outdatedPackages(projectFolder) {
    const outdated = await execute('npm outdated --json', projectFolder);
    const packages = outdated.length > 0 ? JSON.parse(outdated) : {};

    return Object.entries(packages).map(([name, versions]) => {
      return { name, versions };
    });
  },

  async installPackages(projectFolder) {
    await executeLive('npm install', projectFolder);
  },

  async runTest(projectFolder) {
    try {
      await executeLive('npm test', projectFolder);
      return true;
    } catch(error) {
      return false;
    }
  }
};
