'use strict';

const checkProject = require('./check-project');
const { updatePackages } = require('./modules/package-json');
const command = require('./modules/command');

const flags = require('./modules/cli-flags');
const { folders, install } = flags.check();

(async () => {
  for (let folder of folders) {
    const packagesToUpdate = await checkProject(folder);
    await updatePackages(folder, packagesToUpdate);

    install && await command.installPackages(folder);
  }
})();
