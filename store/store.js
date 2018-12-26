'use strict';

const ConfigStore = require('configstore');
const pkg = require('../package');

module.exports = new ConfigStore(pkg.name, {
  config: {},
  packages: {}
});
