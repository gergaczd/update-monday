'use strict';

const questions = require('../../modules/question');
const configRegistry = require('../../store/config-registry');

//folders
module.exports = async () => {
  console.log('You can overwrite here the default config. No worries you will be always able to modify this even for only one project before starting the script.');

  const config = configRegistry.getConfig();

  const store = await questions.shouldStorePackageUpdateByDefault({ initial: config.store });
  const install = await questions.shouldInstallPackagesByDefault({ initial: config.install });
  const open = await questions.shouldOpenChangelogByDefault({ initial: config.open });
  const test = await questions.shouldRunTestsByDefault({ initial: config.test });

  configRegistry.updateConfig({ store, install, open, test });
};
