'use strict';

const ConfigStore = require('configstore');

module.exports = {
  stubDate(date = Date.now()) {
    sinonSandbox.useFakeTimers(date);
    return date;
  },

  stubStoreMethod(method) {
    return sinonSandbox.stub(ConfigStore.prototype, method);
  },

  createMetaInfo(meta = {}) {
    return {
      project: 'test-project',
      newVersion: '6.5.4',
      oldVersion: '5.4.3',
      update: true,
      ...meta
    };
  }
};
