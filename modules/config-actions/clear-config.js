'use strict';

const configRegistry = require('../../store/config-registry');

module.exports = () => {
  configRegistry.updateConfig({});
  console.log('Config cleared');
};
