'use strict';

const question = require('../../../modules/question');
const buildUpdateResponse = require('./transformer/build-update-response');
const displayPackageInfo = require('./display/display');
const openChangelog = require('./action/open-changelog');

class DecisionEngine {
  constructor({ flags }) {
    this._flags = flags;
  }

  async decide(outdatedPackages) {
    let mergedResult = {};
    for (const outdatedPackage of outdatedPackages) {
      mergedResult = {
        ...mergedResult,
        ...await this._decideOnOutdatedPackage(outdatedPackage)
      };
    }

    return buildUpdateResponse(outdatedPackages, mergedResult);
  }

  async _decideOnOutdatedPackage(outdatedPackage) {
    const { packageName: name, versions } = outdatedPackage;

    this._showUpdateDetails(outdatedPackage);
    return await question.shouldUpdatePackage({ name, versions });
  }

  _showUpdateDetails(outdatedPackage) {
    displayPackageInfo({ outdatedPackage });

    if (this._flags.open) {
      openChangelog(outdatedPackage.usefulLinks);
    }
  }
}

module.exports = ({ flags }) => {
  const decider = new DecisionEngine({ flags });

  return async (outdatedInfo) => {
    return await decider.decide(outdatedInfo);
  };
};
