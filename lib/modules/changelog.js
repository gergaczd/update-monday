'use strict';

const changelog = require('changelog');
const chalk = require('chalk');
const { distanceInWordsToNow } = require('date-fns');
const axios = require('axios');
const opn = require('opn');


const formatLink = (link) => {
  return chalk.underline.bold.magenta(link)
};

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

  async requestForChangelogFiles() {
    const requests = Object.keys(this._changelogs).map(async (packageName) => {
      this._changelogs[packageName].changelogFile = await this._detectChangelogFiles(packageName);
    });

    await Promise.all(requests);
  }

  showChangelogFile(name) {
    const changes = this._changelogs[name];
    const changelogFile = changes.changelogFile;

    console.log(`   - Releases: ${formatLink(`${changes.project.repository}/releases`)}`);

    if (changelogFile) {
      console.log(`   - Changelog: ${formatLink(changelogFile)}`);
      opn(changelogFile, { wait: false });
    }
  }

  show({ name, versions }) {
    const changes = this._changelogs[name];

    console.log(`   - Repository: ${formatLink(changes.project.repository)}`);

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

    return changes.versions.slice(latestIndex, currentIndex + 1);
  }

  async _detectChangelogFiles(packageName) {
    const changelog = this._changelogs[packageName];
    const urls = this._getPossibleChangelogUrlsForRepository(changelog.project.repository);

    const option = { validateStatus(status) { return status < 500; } };
    const responses = await Promise.all(urls.map(url => axios.get(url, option)));
    const index = responses.map(response => response.status).indexOf(200);

    return urls[index];
  }

  _getPossibleChangelogUrlsForRepository(repository) {
    const baseUrl = `${repository}/blob/master/`;
    return [
      'History.md', 'history.md', 'CHANGELOG.md', 'Changelog.md', 'changelog.md'
    ].map(file => `${baseUrl}${file}`);
  }
};
