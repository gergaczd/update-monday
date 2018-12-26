'use strict';

const store = require('../../store/store');

module.exports = () => {
  store.set('packages', {});
  console.log('Package history cleared');
};
