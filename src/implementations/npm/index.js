'use strict';

const PackageJsonHandler = require('./package-json/package-json');
const updateDependencies = require('./update-dependencies/update-dependencies');
const { installPackages, runTest, outdatedPackages} = require('./command');
const buildOutdatedPackages = require('./transformers/build-outdated-packages');

module.exports = (folder) => {
  const packageJsonHandler = new PackageJsonHandler(folder);

  return {
    async getOutdatedPackages() {
      return buildOutdatedPackages(
        await outdatedPackages(folder)
      );
    },
    collectChangelog(outdatedPackages) {

    },
    async updateDependencies(decisionResult) {
      return await updateDependencies(packageJsonHandler, decisionResult);
    },
    async installDependencies() {
      return await installPackages(folder);
    },
    async rollbackChanges() {
      return await packageJsonHandler.restore();
    },
    async testProject() {
      return await runTest(folder);
    }
  };
};
