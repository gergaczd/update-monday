#!/usr/bin/env node
'use strict';

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const updateProject = require('./modules/update-project');
const flags = require('./lib/parse-cli')();

(async () => {
  try {
    for (let folder of flags.folders) {
      await updateProject(folder, flags);
    }

    updateNotifier({pkg}).notify();
    process.exit(0);
  } catch (error) {
    console.log(error.name + ': ' + error.message);
    console.log(error.stack);
    console.log('exiting...');
    process.exit(0);
  }
})();
