'use strict';

const yargs = require('yargs').argv;
const checkProject = require('./check-project');
const { updatePackages } = require('./modules/package-json');

const folders = yargs._;

(async () => {
  for (let folder of folders) {
    const packagesToUpdate = await checkProject(folder);
    await updatePackages(folder, packagesToUpdate);

    console.log('Updating packages...');
  }
})();
