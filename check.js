'use strict';

const { prompt } = require('enquirer');
const chalk = require('chalk');
const { updatePackages } = require('./package-json');
const yargs = require('yargs').argv;
const Changelog = require('./changelog');
const { command } = require('./command');

const folders = yargs._;

const generateQuestion = ({ name, versions }) => {
  return {
    name,
    type: 'confirm',
    message: `${chalk.bold(name)} from ${versions.current} -> ${versions.latest}`
  };
};

(async () => {
  for (let folder of folders) {
    console.log(`check project: ${folder}`);
    const outdated = await command(`cd ${folder} && npm outdated --json`);
    const packages = outdated.length > 0 ? JSON.parse(outdated) : {};

    const packageList = Object.entries(packages).map(([name, versions ]) => {
      return { name, versions };
    });

    const changelog = new Changelog(packageList);

    let allAnswers = {};

    await changelog.requestAll();

    for(let packageToCheck of packageList) {
      const question = generateQuestion(packageToCheck);
      changelog.show(packageToCheck);
      const answer = await prompt([question]);

      allAnswers = { ...allAnswers, ...answer };
    }

    const updatablePackages = Object.entries(allAnswers)
      .filter(([packageName, shouldUpdate]) => shouldUpdate)
      .map(([packageName]) => packageName);


    const packagesToUpdate = updatablePackages.map(packageName => {
      return { name: packageName, version: packages[packageName].latest };
    });

    await updatePackages(folder, packagesToUpdate);

    console.log('Updating packages...');

    // await runCommand(`cd ${folder} && npm it`);
  }
})();
