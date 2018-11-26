'use strict';

const yargs = require('yargs').argv;

module.exports = {
  check() {
    return {
      install: !!yargs.i,
      folders: [].concat(yargs._, yargs.i).filter(folder => typeof folder === 'string')
    };
  }
};
