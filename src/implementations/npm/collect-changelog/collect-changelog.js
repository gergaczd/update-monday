'use strict';

const versionHistory = require('./version-history');

const buildOutdatedPackageInfo = require('../transformers/build-outdated-package-info');

module.exports = async (outdatedPackages) => {
  const packageNames = outdatedPackages.map(({ packageName }) => packageName);
  const versionHistories = await versionHistory.getHistory(packageNames);

  //decorate with changelog file

  return buildOutdatedPackageInfo(outdatedPackages, versionHistories);
};
