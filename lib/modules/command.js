'use strict';

const { execute } = require('../execute-command');

module.exports = {
  async outdatedPackages(projectFolder) {
    const outdated = await execute(`cd ${projectFolder} && npm outdated --json`);
    const packages = outdated.length > 0 ? JSON.parse(outdated) : {};

    return Object.entries(packages).map(([name, versions]) => {
      return { name, versions };
    });
  },

  async installPackages(projectFolder) {
    await execute(`cd ${projectFolder} && npm install`);
  }
};
