'use strict';

const semver = require('semver');

module.exports = (givenVersions, versionsToMatch) => {
  return versionsToMatch.filter(({ newVersion, oldVersion }) => {
    const intersectFromOldPerspective = semver.lt(givenVersions.oldVersion, newVersion);
    const intersectFromNewPerspective = semver.gte(givenVersions.newVersion, oldVersion);

    return intersectFromOldPerspective && intersectFromNewPerspective;
  });
};
