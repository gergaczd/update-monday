'use strict';

const Changelog = require('./changelog/changelog');
const question = require('./question');
const { showUpdateHistoryForPackage } = require('./update-history');

module.exports = async (packages, { open }) => {
  const changelog = new Changelog(packages);
  await changelog.requestChanges();

  let allAnswers = {};

  for (const packageToCheck of packages) {
    changelog.displayChanges(packageToCheck);
    open && changelog.openChangelogFile(packageToCheck.name);

    showUpdateHistoryForPackage(packageToCheck);

    const answer = await question.shouldUpdatePackage(packageToCheck);

    allAnswers = { ...allAnswers, ...answer };
  }

  return packages.map(({ name, versions }) => {
    return { name, version: versions.latest, oldVersion: versions.current, update: allAnswers[name] };
  });
};
