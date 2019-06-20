'use strict';

const modifyDependencies = require('../transformers/modify-dependencies');

module.exports = async (packageJsonHandler, decisionResults) => {
  const oldPackageJson = await packageJsonHandler.read();
  const newPackageJson = modifyDependencies(oldPackageJson, decisionResults);
  await packageJsonHandler.update(newPackageJson);
};
