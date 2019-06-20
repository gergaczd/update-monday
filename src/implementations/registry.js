'use strict';

const implementationMap = new Map();
implementationMap.set('npm', require('./npm'));

module.exports = {
  findImplementation(implementationName) {
    if (!implementationMap.has(implementationName)) {
      throw new Error(`Implementation is missing: ${implementationName}`);
    }

    return implementationMap.get(implementationName);
  }
};
