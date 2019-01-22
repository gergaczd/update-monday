'use strict';

const opn = require('opn');
const request = require('./request');
const display = require('./display');

module.exports = class Changelog {
  constructor(packages) {
    this._packages = packages;
    this._changelogs = {};
  }

  get packageNames() {
    return Object.keys(this._changelogs);
  }

  async requestChanges() {
    this._changelogs = await request.getVersionHistories(this._packages);

    const requests = this.packageNames.map(async (packageName) => {
      const repository = this._getRepositoryUrl(packageName);
      this._changelogs[packageName].changelogFile = await request.getChangelogFile(repository);
    });

    await Promise.all(requests);
  }

  displayChanges({ name, versions }) {
    display({
      name,
      currentVersion: versions.current,
      latestVersion: versions.latest,
      versionHistory: this._getVersionHistory(name),
      repositoryUrl: this._getRepositoryUrl(name),
      releasesUrl: this._getReleasesUrl(name),
      changelogFile: this._getChangelogFile(name)
    });
  }

  openChangelogFile(name) {
    const changelogFile = this._getChangelogFile(name);
    if (changelogFile) {
      opn(changelogFile, { wait: false })
    } else {
      opn(this._getReleasesUrl(name), { wait: false });
    }
  }

  _getRepositoryUrl(packageName) {
    return this._changelogs[packageName].project.repository;
  }

  _getReleasesUrl(name) {
    return `${this._getRepositoryUrl(name)}/releases`;
  }

  _getVersionHistory(packageName) {
    return this._changelogs[packageName].versions;
  }

  _getChangelogFile(packageName) {
    return this._changelogs[packageName].changelogFile;
  }
};
