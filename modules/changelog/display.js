'use strict';

const emoji = require('node-emoji');
const { distanceInWordsToNow } = require('date-fns');
const format = require('../../lib/display-fomat');
const semver = require('semver');

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
    console.log(format.bold(emoji.get('package') + ' ' + name + '@' + latestVersion + ':'));
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
      const versionTag = this._getVersionTag(change.version);
      console.log(format.version(`\t* Version: ${change.version} - ${relativeTime} ago ${versionTag}`));
    });
  }

  _getVersionTag(version) {
    const versionTag = version === this._options.currentVersion ? '(current)' :
      (version === this._options.latestVersion ? '(latest)' : '');

    return format.italic(versionTag)
  }

  get actualChanges() {
    const { currentVersion, latestVersion, versionHistory } = this._options;

    const latestIndex = versionHistory.findIndex(({ version }) => version === latestVersion);
    const currentIndex = versionHistory.findIndex(({ version }) => version === currentVersion);

    return versionHistory
      .slice(latestIndex, currentIndex + 1)
      .filter(({ version }) => {
        return semver.gte(version, currentVersion) && semver.lte(version, latestVersion);
      })
      .filter(({ version }) => !semver.prerelease(version));
  }
}

module.exports = (options) => (new DisplayChanges(options)).display();
