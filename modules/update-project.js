'use strict';


const checkProject = require('./check-project');
const packageJson = require('./package-json');
const command = require('./command');
const { omit } = require('lodash');
const stepMarker = require('../lib/step-marker');
const question = require('./question');

const listPackages = (packages) => {
  console.table(packages.map(({ name, versions }) => {
    return { name, ...omit(versions, ['location']) };
  }));
};

module.exports = async (folder, { install, open, test }) => {
  stepMarker.updatingProject(folder);
  const packages = await command.outdatedPackages(folder);
  listPackages(packages);

  stepMarker.checkingChangelogs();
  const packagesWithUpdateInfo = await checkProject(packages, { open });
  await packageJson.updatePackages(folder, packagesWithUpdateInfo);

  if (install) {
    stepMarker.installingPackages();
    await command.installPackages(folder);
  }

  if (install && test) {
    stepMarker.runningTests();
    const isTestSuccessed = await command.runTest(folder);
    const shouldRollback = !isTestSuccessed && await question.shouldRollbackUpdate();

    if (shouldRollback) {
      await packageJson.rollbackUpdate(folder, packagesWithUpdateInfo);
      stepMarker.installingPackages();
      await command.installPackages(folder);
    }
  }

  console.table(packagesWithUpdateInfo);

  stepMarker.updatingFinished(folder);
  return packagesWithUpdateInfo;
};
