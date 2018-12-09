'use strict';

const cliArgs = require('yargs');

module.exports = () => {
  return cliArgs
    .options({
      install: {
        alias: 'i',
        default: false,
        describe: 'install packages after update',
        type: 'boolean'
      },
      open: {
        alias: 'o',
        default: false,
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
        default: false,
        describe: 'Run test after installing updated packages (only if install enabled)',
        type: 'boolean'
      }
    })
    .help()
    .argv;
};
