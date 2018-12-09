'use strict';

const emoji = require('node-emoji');
const format = require('./display-fomat');

module.exports = {
  updatingProject(project) {
    const clapper = emoji.get('clapper');
    console.log('\n\n');
    console.log(format.step(`${clapper} Updating project: ${project}`));
  },

  checkingChangelogs() {
    const clock = emoji.get('clock10');
    console.log('\n\n');
    console.log(format.step(`${clock} Checking changelogs...`));
  },

  installingPackages() {
    const hammer = emoji.get('hammer_and_wrench');
    console.log('\n\n');
    console.log(format.step(`${hammer}  Installing packages`));
  },

  runningTests() {
    const mark = emoji.get('white_check_mark');
    console.log('\n\n');
    console.log(format.step(`${mark} Running tests`))
  },

  updatingFinished(project) {
    const flag = emoji.get('checkered_flag');
    console.log('\n\n');
    console.log(format.step(`${flag} Finished updating ${project}`))
  }
};
