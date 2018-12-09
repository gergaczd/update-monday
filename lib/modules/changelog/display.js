'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const { distanceInWordsToNow } = require('date-fns');

const format = {
  link: (link) => chalk.underline.bold.magenta(link),
  version: (version) => chalk.dim(version)
};

class DisplayChanges {

  constructor(options) {
    this._options = options;
  }

  display() {

    this._displayPackageInfo();
    this._displayLinks();
    this._displayChanges();
  }

  _displayPackageInfo() {
    const { latestVersion, name } = this._options;

    console.log('\n\n');
    console.log(chalk.bold(emoji.get('package') + ' ' + name + '@' + latestVersion + ':'));
  }

  _displayLinks() {
    const { changelogFile, repositoryUrl } = this._options;

    console.log(`   - Repository: ${format.link(repositoryUrl)}`);
    console.log(`   - Releases: ${format.link(`${repositoryUrl}/releases`)}`);

    if (changelogFile) {
      console.log(`   - Changelog: ${format.link(changelogFile)}`);
    }
  }

  _displayChanges() {
    this.actualChanges.forEach((change) => {
      const relativeTime = distanceInWordsToNow(new Date(change.date));
      console.log(format.version(`\t* Version: ${change.version} - ${relativeTime} ago`));
    });
  }

  get actualChanges() {
    const { currentVersion, latestVersion, versionHistory } = this._options;

    const latestIndex = versionHistory.findIndex(({ version }) => version === latestVersion);
    const currentIndex = versionHistory.findIndex(({ version }) => version === currentVersion);

    return versionHistory.slice(latestIndex, currentIndex + 1);
  }
}

module.exports = (options) => (new DisplayChanges(options)).display();
