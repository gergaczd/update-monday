'use strict';

const configRegistry = require('../../store/config-registry');

module.exports = () => {
  console.log('This is your stored config');
  console.log(JSON.stringify(configRegistry.getConfig(), null, 4));
};
