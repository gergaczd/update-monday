#!/usr/bin/env node
'use strict';

const checkProject = require('./modules/check-project');
const { updatePackages } = require('./modules/package-json');
const command = require('./modules/command');
const flags = require('./lib/parse-cli')();
const { uniqWith, omit } = require('lodash');
const { isDeepStrictEqual } = require('util');

(async () => {
  try {
    let packageInformations = [];
    for (let folder of flags.folders) {
      const packages = await checkProject(folder, flags);
      await updatePackages(folder, packages);

      flags.install && await command.installPackages(folder);

      packageInformations = uniqWith(packageInformations.concat(packages), (first, second) => {
        return isDeepStrictEqual(omit(first, ['update']), omit(second, ['update']));
      });

      console.table(packages);
    }
  } catch (error) {
    console.log(error.name + ': ' + error.message);
    console.log(error.stack);
    console.log('exiting...');
  }
})();
