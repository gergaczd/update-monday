#!/usr/bin/env node
'use strict';

const checkProject = require('./lib/check-project');
const { updatePackages } = require('./lib/modules/package-json');
const command = require('./lib/modules/command');

const flags = require('./lib/modules/cli-flags');
const { folders, install } = flags.check();

(async () => {
  for (let folder of folders) {
    const packagesToUpdate = await checkProject(folder);
    await updatePackages(folder, packagesToUpdate);

    install && await command.installPackages(folder);
  }
})();
