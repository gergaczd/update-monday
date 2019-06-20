'use strict';

const { get } = require('lodash');

module.exports = (outdatedPackages, updateResults) => {
  return outdatedPackages.map((outdatedPackage) => {
    return {
      ...outdatedPackage,
      update: get(updateResults, outdatedPackage.packageName, false)
    };
  });
};
