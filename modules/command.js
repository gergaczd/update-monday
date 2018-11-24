'use strict';

const { command } = require('../lib/command');

module.exports = {
  async outdatedPackages(projectFolder) {
    const outdated = await command(`cd ${projectFolder} && npm outdated --json`);
    const packages = outdated.length > 0 ? JSON.parse(outdated) : {};

    return Object.entries(packages).map(([name, versions]) => {
      return { name, versions };
    });
  },

  async installPackages(projectFolder) {
    await command(`cd ${projectFolder} && npm install`);
  }
};
