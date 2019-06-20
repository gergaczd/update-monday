'use strict';

const emoji = require('node-emoji');
const { distanceInWordsToNow } = require('date-fns');
const format = require('../../../../lib/display-fomat');
const semver = require('semver');

class PackageDisplay {
  constructor({ screen, outdatedPackage }) {
    this._screen = screen;
    this._outdatedPackage = outdatedPackage;
  }

  show() {
    this._screen('\n\n');
    this._showPackageInfo();
    this._showLinks();
    this._showHistory();
  }

  get _relevantVersions() {
    return this._outdatedPackage.versions.history
      .filter(({ version }) => !semver.lt(version, this._currentVersion))
      .filter(({ version }) => !semver.gt(version, this._latestVersion))
      .filter(({ version }) => !semver.prerelease(version));
  }

  get _packageName() {
    return this._outdatedPackage.packageName;
  }

  get _currentVersion() {
    return this._outdatedPackage.versions.current;
  }

  get _latestVersion() {
    return this._outdatedPackage.versions.latest ;
  }

  _showPackageInfo() {
    this._screen(
      format.bold(emoji.get('package') + ' ' + this._packageName + '@' + this._latestVersion + ':')
    );
  }

  _showLinks() {
    const { usefulLinks } = this._outdatedPackage;

    usefulLinks.forEach(({ name, url }) => {
      this._screen(`   - ${name}: ${format.link(url)}`);
    });
  }

  _showHistory() {
    this._relevantVersions.forEach(({ version, releaseDate }) => {
      const relativeTime = distanceInWordsToNow(new Date(releaseDate));
      const tag = this._getTag(version);
      this._screen(format.version(`\t* Version: ${version} - ${relativeTime} ago ${tag}`));
    });
  }

  _getTag(version) {
    const currentTag = version === this._currentVersion ? '(current)' : '';
    const latestTag = version === this._latestVersion ? '(latest)' : '';

    return format.italic(currentTag + latestTag);
  }
}

module.exports = ({ screen = console.log, outdatedPackage }) => {
  return new PackageDisplay({ screen, outdatedPackage }).show();
};
