'use strict';

const emoji = require('node-emoji');
const chalk = require('chalk');


module.exports = {
  updatingProject(project) {
    console.log('\n\n');
    console.log(chalk.bold.green(`${emoji.get('hammer_and_wrench')}  Updating project: ${project}`));
  },

  checkingChangelogs() {
    console.log(chalk.bold.green(`${emoji.get('clock10')} Checking changelogs...`));
  }
};
