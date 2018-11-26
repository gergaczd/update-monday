'use strict';

const Changelog = require('./modules/changelog');
const command = require('./modules/command');
const shouldUpdatePackage = require('./modules/question');
const { resolveFlags } = require('./modules/flags/cli-flags');
const flags = resolveFlags();

module.exports = async (folder) => {
  console.log(`check project: ${folder}`);

  const packages = await command.outdatedPackages(folder);
  const changelog = new Changelog(packages);
  await changelog.requestAll();

  let allAnswers = {};

  for (let packageToCheck of packages) {
    if (flags.open) {
      await changelog.checkChangelogFiles(packageToCheck.name);
    }
    changelog.show(packageToCheck);
    const answer = await shouldUpdatePackage(packageToCheck);

    allAnswers = { ...allAnswers, ...answer };
  }

  return packages
    .filter(({ name }) => allAnswers[name])
    .map(({ name, versions }) => {
      return { name, version: versions.latest };
    });
};
