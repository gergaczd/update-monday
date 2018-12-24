'use strict';

const ConfigStore = require('configstore');
const pkg = require('../package');
const { pick } = require('lodash');
const filterWithinRange = require('./filter-within-range');

const packageStore = new ConfigStore(pkg.name, {
  config: {},
  packages: {}
});

module.exports = class {
  static registerPackage(packageName, metaInformation) {
    const key = this._getPackageKey(packageName);
    const meta = this._buildMetaForStore(metaInformation);
    if (!packageStore.has(key)) {
      packageStore.set(key, [meta]);
    } else {
      this._mergeMetaWithPrevious(key, meta);
    }
  }

  static getMatchingRegistration(packageName, metaInfo) {
    const key = this._getPackageKey(packageName);

    if (!packageStore.has(key)) {
      return [];
    }

    const storedMetaInfo = packageStore.get(key);
    return filterWithinRange(metaInfo, storedMetaInfo);
  }

  static _mergeMetaWithPrevious(key, meta) {
    const previousInfo = packageStore.get(key);
    const allInfo = [meta].concat(previousInfo);
    packageStore.set(key, allInfo.slice(0, 5));
  }

  static _getPackageKey(packageName) {
    return `packages.${packageName}`;
  }

  static _buildMetaForStore(metaInformation) {
    return {
      ...pick(metaInformation, this._whitelistedFields),
      date: Date.now()
    }
  }

  static get _whitelistedFields() {
    return [
      'project',
      'oldVersion',
      'newVersion',
      'update'
    ];
  }
};

