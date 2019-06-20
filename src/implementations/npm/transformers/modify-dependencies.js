'use strict';

const { get } = require('lodash');

const createDependencyUpdater = (path) => {
  return (packageJson, outdatedPackage) => {
    if (isDependency(path, packageJson, outdatedPackage)) {
      updateDependency(path, packageJson, outdatedPackage);
    }
  };
};

const isDependency = (path, packageJson, outdatedPackage) => {
  const version = get(packageJson, `${path}.${outdatedPackage.packageName}`);
  return version === outdatedPackage.versions.current;
};

const updateDependency = (path, packageJson, outdatedPackage) => {
  packageJson[path][outdatedPackage.packageName] = outdatedPackage.versions.latest;
};

const updateAsDependency = createDependencyUpdater('dependencies');
const updateAsDevDependency = createDependencyUpdater('devDependencies');

module.exports = (packageJson, outdatedPackages) => {
  outdatedPackages
    .filter(({ update }) => update)
    .forEach((outdatedPackage) => {
      updateAsDependency(packageJson, outdatedPackage);
      updateAsDevDependency(packageJson, outdatedPackage);
  });

  return packageJson;
};
