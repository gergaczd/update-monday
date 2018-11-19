'use strict';

const { exec } = require('child_process');

module.exports = {
  async command(command) {
    return await new Promise((resolve) => {
      exec(command, (error, stdout) => {
        resolve(stdout);
      });
    })
  }
};
