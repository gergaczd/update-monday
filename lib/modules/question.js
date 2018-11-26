'use strict';

const prompts = require('prompts');
const chalk = require('chalk');

module.exports = async ({ name, versions }) => {
  return await prompts({
    name,
    type: 'toggle',
    message: `${chalk.bold(name)} from ${versions.current} -> ${versions.latest}`,
    initial: true,
    active: 'yes',
    inactive: 'no'
  });
};
