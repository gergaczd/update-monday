'use strict';

const semver = require('semver');

module.exports = (versions, versionsToMatch) => {
  return versionsToMatch.filter(({ newVersion, oldVersion }) => {
    const newVersionIsLessOrEqual = semver.lte(versions.newVersion, newVersion);
    const oldVersionIsGreaterOrEqual = semver.gte(versions.oldVersion, oldVersion);

    return newVersionIsLessOrEqual && oldVersionIsGreaterOrEqual;
  });
};
