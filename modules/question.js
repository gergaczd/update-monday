'use strict';

const { prompt } = require('enquirer');
const chalk = require('chalk');

module.exports = async ({ name, versions }) => {
  const question = {
    name: name,
    type: 'confirm',
    message: `${chalk.bold(name)} from ${versions.current} -> ${versions.latest}`
  };

  return await prompt([question]);
};
