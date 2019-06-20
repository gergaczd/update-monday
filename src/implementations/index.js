'use strict';

const registry = require('./registry');

module.exports = (implementationName, folder) => {
  const implementation = registry.findImplementation(implementationName);
  return implementation(folder);
};



