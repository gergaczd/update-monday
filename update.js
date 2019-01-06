#!/usr/bin/env node
'use strict';

const updateProject = require('./modules/update-project');
const flags = require('./lib/parse-cli')();

(async () => {
  try {
    for (let folder of flags.folders) {
      await updateProject(folder, flags);
    }
  } catch (error) {
    console.log(error.name + ': ' + error.message);
    console.log(error.stack);
    console.log('exiting...');
  }
})();