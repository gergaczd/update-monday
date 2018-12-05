'use strict';

const Changelog = require('./modules/changelog');
const command = require('./modules/command');
const shouldUpdatePackage = require('./modules/question');
const { resolveFlags } = require('./modules/cli-flags');
const flags = resolveFlags();
const chalk = require('chalk');
const emoji = require('node-emoji');

module.exports = async (folder) => {
  console.log(`check project: ${folder}`);

  const packages = await command.outdatedPackages(folder);

  console.table(packages);

  const changelog = new Changelog(packages);
  await changelog.requestAll();

  if (flags.open) {
    await changelog.requestForChangelogFiles();
  }

  let allAnswers = {};

  for (let packageToCheck of packages) {

    console.log('\n\n');
    console.log(chalk.bold(emoji.get('package') + ' ' + packageToCheck.name + '@' + packageToCheck.versions.latest + ':'));

    if (flags.open) {
      await changelog.showChangelogFile(packageToCheck.name);
    }
    changelog.show(packageToCheck);
    const answer = await shouldUpdatePackage(packageToCheck);

    allAnswers = { ...allAnswers, ...answer };
  }

  return packages.map(({ name, versions }) => {
    return { name, version: versions.latest, oldVersion: versions.current, update: allAnswers[name] };
  });
};
