'use strict';

const defaultPackageName = 'test-packageName';
const currentVersion = '2.3.4';
const latestVersion = '3.4.5';

const outdatedPackage = ({
   packageName = defaultPackageName, current = currentVersion, latest = latestVersion
} = {}) => {
  return {
    packageName,
    versions: {
      current,
      latest
    }
  };
};

const decoratedOutdatedPackage = ({
    packageName = defaultPackageName, versions = createVersions(), usefulLinks = createUsefulLinks()
  }) => {
  return {
    packageName,
    versions,
    usefulLinks
  };
};

const createVersions = ({
  current = currentVersion, latest = latestVersion, history = generateHistory()
} = {}) => {
  return {
    current,
    latest,
    history
  };
};

const generateHistory = () => {
  return [
    oldVersion('2.3.3'),
    oldVersion('2.3.2'),
    oldVersion('2.3.1')
  ];
};

const oldVersion = (version, releaseDate = '2018-03-02T00:00:00') => {
  return { version, releaseDate };
};

const createUsefulLinks = () => {
  return [
    link('Repository', 'https://repository.url'),
    link('Changelog', 'https://changelog.url')
  ];
};

const link = (name, url = 'https://test.url') => {
  return { name, url };
};



const outdatedPackageWithUpdate = ({
   packageName = defaultPackageName,
   versions = createVersions(),
   update = true
}) => {
  return {
    ...decoratedOutdatedPackage({ packageName, versions }),
    update
  };
};


module.exports = {
  versions: createVersions,
  usefulLinks: createUsefulLinks,
  link,
  oldVersion,
  outdatedPackage,
  decoratedOutdatedPackage,
  outdatedPackageWithUpdate
};
