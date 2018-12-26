'use strict';

const cliArgs = require('yargs');
const configRegistry = require('../store/config-registry');

module.exports = () => {
  const config = configRegistry.getConfig();
  return cliArgs
    .options({
      store: {
        alias: 's',
        default: config.store,
        describe: 'store update to easily decide on another project',
        type: 'boolean'
      },
      install: {
        alias: 'i',
        default: config.install,
        describe: 'install packages after update',
        type: 'boolean'
      },
      open: {
        alias: 'o',
        default: config.open,
        describe: 'open changelog file if exists',
        type: 'boolean'
      },
      folders: {
        alias: 'f',
        default: './',
        describe: 'folders where projects live',
        type: 'array'
      },
      test: {
        alias: 't',
        default: config.test,
        describe: 'Run test after installing updated packages (only if install enabled)',
        type: 'boolean'
      }
    })
    .help()
    .argv;
};
