'use strict';

const { get, fromPairs } = require('lodash');

const mapByPackageName = (entries) => {
  const pairs = entries.map(entry => [entry.packageName, entry]);
  return fromPairs(pairs);
};

module.exports = (outdatedPackages, packageVersionsWithUrls) => {
  const packageNameVersionMap = mapByPackageName(packageVersionsWithUrls);

  return outdatedPackages.map(outdatedPackage => {
    const packageName = outdatedPackage.packageName;
    return {
      ...outdatedPackage,
      versions: {
        ...outdatedPackage.versions,
        history: get(packageNameVersionMap, `${packageName}.versions`, [])
      },
      usefulLinks: get(packageNameVersionMap, `${packageName}.links`, [])
    }
  });
};
