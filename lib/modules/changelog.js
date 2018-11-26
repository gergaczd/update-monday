'use strict';

const changelog = require('lib/modules/changelog');
const chalk = require('chalk');
const { distanceInWordsToNow } = require('date-fns');
const axios = require('axios');
const opn = require('opn');

module.exports = class Changelog {
  constructor(packages) {
    this._packages = packages;
    this._changelogs = {};
  }

  async requestAll() {
    const changelogs = await this._requestChangelogs();

    const packageChangelogs = this._packages.map(({ name }, index) => {
      return { [name]: changelogs[index] };
    });

    this._changelogs = packageChangelogs.reduce((acc, value) => {
      return { ...acc, ...value };
    }, {});
  }

  async checkChangelogFiles(name) {
    console.log('\n\n');
    const changes = this._changelogs[name];
    const baseUrl = `${changes.project.repository}/blob/master/`;
    const commonChangelogUrls = [
      'History.md', 'history.md', 'CHANGELOG.md', 'Changelog.md', 'changelog.md'
    ].map(file => `${baseUrl}${file}`);

    const option = { validateStatus(status) { return status < 500; } };
    const responses = await Promise.all(commonChangelogUrls
      .map(url => axios.get(url, option))
    );

    const index = responses.map(response => response.status).indexOf(200);

    console.log(`- Releases: ${chalk.blue(`${changes.project.repository}/releases`)}`);

    if (index > -1) {
      console.log(`- Changelog: ${chalk.blue(commonChangelogUrls[index])}`);
      opn(commonChangelogUrls[index]);
    }
  }

  show({ name, versions }) {
    const changes = this._changelogs[name];

    console.log(`- Repository: ${chalk.blue(changes.project.repository)}`);

    const actualChanges = this._getActualChanges({ name, versions });

    actualChanges.forEach((change) => {
      console.log(chalk.dim(`\t* Version: ${change.version} - ${distanceInWordsToNow(new Date(change.date))} ago`));
    });
  }

  async _requestChangelogs() {
    const changelogRequests = this._packages.map(({ name }) => {
      return changelog.generate(name, 'all');
    });

    return await Promise.all(changelogRequests);
  }

  _getActualChanges({ name, versions }) {
    const changes = this._changelogs[name];

    const latestIndex = changes.versions.findIndex(({ version }) => version === versions.latest);
    const currentIndex = changes.versions.findIndex(({ version }) => version === versions.current);

    return changes.versions.slice(latestIndex, currentIndex);
  }
};
