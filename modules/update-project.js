'use strict';


const checkProject = require('./check-project');
const packageJson = require('./package-json');
const command = require('./command');
const { omit } = require('lodash');
const stepMarker = require('../lib/step-marker');
const question = require('./question');
const PackageRegistry = require('../store/package-registry');
const { transformUpdatesForRegistry } = require('../lib/transformer');

const listPackages = (packages) => {
  console.table(packages.map(({ name, versions }) => {
    return { name, ...omit(versions, ['location']) };
  }));
};

module.exports = async (folder, { install, open, test, store }) => {
  stepMarker.updatingProject(folder);
  const packages = await command.outdatedPackages(folder);
  listPackages(packages);

  stepMarker.checkingChangelogs();
  const { name: projectName } = await packageJson.readPackageJson(folder);
  const packagesWithUpdateInfo = await checkProject(packages, { open, projectName });

  const updateNeeded = packagesWithUpdateInfo.some(info => info.update);
  updateNeeded && await packageJson.updatePackages(folder, packagesWithUpdateInfo);

  if (updateNeeded && install) {
    stepMarker.installingPackages();
    await command.installPackages(folder);
  }

  if (updateNeeded && install && test) {
    let isTestSuccessed = false;
    do {
      stepMarker.runningTests();
      isTestSuccessed = await command.runTest(folder);
    } while (!isTestSuccessed && await question.shouldRunTestsAgain());

    const shouldRollback = !isTestSuccessed && await question.shouldRollbackUpdate();

    if (shouldRollback) {
      await packageJson.rollbackUpdate(folder, packagesWithUpdateInfo);
      stepMarker.installingPackages();
      await command.installPackages(folder);
    }
  }

  console.table(packagesWithUpdateInfo);

  if (store) {
    const transformedUpdateInfo = transformUpdatesForRegistry(projectName, packagesWithUpdateInfo);

    transformedUpdateInfo.forEach((updateInfo) => {
      PackageRegistry.registerPackage(updateInfo.packageName, updateInfo);
    });
  }

  stepMarker.updatingFinished(folder);
};
