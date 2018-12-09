'use strict';


const checkProject = require('./check-project');
const { updatePackages } = require('./package-json');
const command = require('./command');
const { omit } = require('lodash');
const stepMarker = require('../lib/step-marker');


const listPackages = (packages) => {
  console.table(packages.map(({ name, versions }) => {
    return { name, ...omit(versions, ['location']) };
  }));
};

module.exports = async (folder, { install, open }) => {
  stepMarker.updatingProject(folder);

  const packages = await command.outdatedPackages(folder);
  listPackages(packages);

  stepMarker.checkingChangelogs();
  const packagesWithUpdateInfo = await checkProject(packages, { open });
  await updatePackages(folder, packagesWithUpdateInfo);

  install && await command.installPackages(folder);

  console.table(packagesWithUpdateInfo);

  return packagesWithUpdateInfo;
};
