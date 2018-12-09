'use strict';

const emoji = require('node-emoji');
const format = require('./display-fomat');

module.exports = {
  updatingProject(project) {
    const hammer = emoji.get('hammer_and_wrench');
    console.log('\n\n');
    console.log(format.step(`${hammer}  Updating project: ${project}`));
  },

  checkingChangelogs() {
    const clock = emoji.get('clock10');
    console.log(format.step(`${clock} Checking changelogs...`));
  }
};
