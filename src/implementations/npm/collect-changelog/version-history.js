'use strict';

const changelog = require('./generate');

module.exports = {
  async getHistory(packageNames) {
    const changelogRequests = packageNames
      .map(packageName => changelog(packageName));
    const changelogs = await Promise.all(changelogRequests);

    return packageNames.map((packageName, index) => {
      return { packageName, ...changelogs[index] };
    });
  }
};
