'use strict';

const Changelog = require('./modules/changelog/changelog');
const command = require('./modules/command');
const shouldUpdatePackage = require('./modules/question');
const { resolveFlags } = require('./modules/cli-flags');
const flags = resolveFlags();
const { omit } = require('lodash');



module.exports = async (folder) => {
  console.log(`check project: ${folder}`);

  const packages = await command.outdatedPackages(folder);

  console.table(packages.map(({ name, versions }) => {
    return { name, ...omit(versions, ['location']) };
  }));

  const changelog = new Changelog(packages);
  await changelog.requestChanges();

  let allAnswers = {};

  for (let packageToCheck of packages) {
    changelog.displayChanges(packageToCheck);
    flags.open && changelog.openChangelogFile(packageToCheck.name);

    const answer = await shouldUpdatePackage(packageToCheck);

    allAnswers = { ...allAnswers, ...answer };
  }

  return packages.map(({ name, versions }) => {
    return { name, version: versions.latest, oldVersion: versions.current, update: allAnswers[name] };
  });
};
