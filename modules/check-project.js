'use strict';

const Changelog = require('./changelog/changelog');
const command = require('./command');
const question = require('./question');
const { omit } = require('lodash');

module.exports = async (folder, { open }) => {
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
    open && changelog.openChangelogFile(packageToCheck.name);

    const answer = await question.shouldUpdatePackage(packageToCheck);

    allAnswers = { ...allAnswers, ...answer };
  }

  return packages.map(({ name, versions }) => {
    return { name, version: versions.latest, oldVersion: versions.current, update: allAnswers[name] };
  });
};
