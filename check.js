#!/usr/bin/env node
'use strict';

const checkProject = require('./lib/check-project');
const { updatePackages } = require('./lib/modules/package-json');
const command = require('./lib/modules/command');
const { resolveFlags } = require('./lib/modules/cli-flags');
const { uniqWith, omit } = require('lodash');
const { isDeepStrictEqual } = require('util');

const { folders, install } = resolveFlags();

(async () => {
  try {
    let packageInformations = [];
    for (let folder of folders) {
      const packages = await checkProject(folder);
      await updatePackages(folder, packages);

      install && await command.installPackages(folder);

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
