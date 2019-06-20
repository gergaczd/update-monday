'use strict';

const { promisify } = require('util');
const fs = require('fs');

module.exports = {
  writeFile: promisify(fs.writeFile),
  readFile: promisify(fs.readFile)
};
