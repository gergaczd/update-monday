#!/usr/bin/env node
'use strict';

const updateProject = require('./modules/update-project');
const flags = require('./lib/parse-cli')();

(async () => {
  try {
    let updatedPackages = [];
    for (let folder of flags.folders) {
      const packages = await updateProject(folder, flags);
      updatedPackages = updatedPackages.concat(packages);
    }
  } catch (error) {
    console.log(error.name + ': ' + error.message);
    console.log(error.stack);
    console.log('exiting...');
  }
})();
