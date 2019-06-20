'use strict';

const stepMarker = require('../../../lib/step-marker');

module.exports = ({ implementation }) => {
  return async () => {
    stepMarker.updatingProject('');
    const outdatedPackages = await implementation.getOutdatedPackages();

    console.table(outdatedPackages);

    stepMarker.checkingChangelogs();
    return await implementation.collectChangelog(outdatedPackages);
  };
};
