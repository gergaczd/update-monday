'use strict';

const Changelog = require('./changelog/changelog');
const question = require('./question');

module.exports = async (packages, { open }) => {
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
