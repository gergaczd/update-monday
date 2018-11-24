'use strict';

const prompts = require('prompts');
const chalk = require('chalk');

module.exports = async ({ name, versions }) => {
  const question = {
    name,
    type: 'toggle',
    message: `${chalk.bold(name)} from ${versions.current} -> ${versions.latest}`,
    initial: true,
    active: 'yes',
    inactive: 'no'
  };

  const result = await prompts(question);

  console.log(result);
  return result;
};
