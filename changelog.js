'use strict';

const changelog = require('changelog');
const chalk = require('chalk');
const { distanceInWordsToNow } = require('date-fns');

module.exports = class Changelog {
  constructor(packages) {
    this._packages = packages;
    this._changelogs = {};
  }

  async requestAll() {
    const changelogRequests = this._packages.map(({ name }) => {
      return changelog.generate(name, 'all');
    });

    const changelogs = await Promise.all(changelogRequests);

    const packageChangelogs = this._packages.map(({ name }, index) => {
      return { [name]: changelogs[index] };
    });

    this._changelogs = packageChangelogs.reduce((acc, value) => {
      return { ...acc, ...value };
    }, {});
  }

  show({ name, versions }) {
    const changes = this._changelogs[name];

    console.log(`\n\n- Repository: ${chalk.blue(changes.project.repository)}`);

    const actualChanges = this._getActualChanges({ name, versions });

    actualChanges.forEach((change) => {
      console.log(chalk.dim(`\t* Version: ${change.version} - ${distanceInWordsToNow(new Date(change.date))} ago`));
    });
  }

  _getActualChanges({ name, versions }) {
    const changes = this._changelogs[name];

    const latestIndex = changes.versions.findIndex(({ version }) => version === versions.latest);
    const currentIndex = changes.versions.findIndex(({ version }) => version === versions.current);

    return changes.versions.slice(latestIndex, currentIndex);
  }
};
///Changelog.md
///CHANGELOG.md
///History.md
///HISTORY.md
