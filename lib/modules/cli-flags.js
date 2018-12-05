'use strict';

const cliArgs = require('yargs');

module.exports = {
  resolveFlags() {
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
          demandOption: true,
          describe: 'folders where projects live',
          type: 'array'
        }
      })
      .help()
      .argv;
  }
};
