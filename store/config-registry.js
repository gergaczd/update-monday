'use strict';

const store = require('./store');
const { pick, merge } = require('lodash');

module.exports = {
  updateConfig(config = {}) {
    const normalizedConfig = this._normalizeConfig(config);
    store.set('config', normalizedConfig);
  },

  getConfig() {
    const config = store.get('config');
    return this._normalizeConfig(config);
  },

  get options() {
    return ['store', 'install', 'open', 'test'];
  },

  _normalizeConfig(config = {}) {
    const normalized = pick(config, this.options);
    const defaultValues = this.options.map(key => ({ [key]: false }));

    return merge(...defaultValues, normalized);
  }

};
