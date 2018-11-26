'use strict';

const { exec } = require('child_process');

module.exports = {
  async execute(executeCommand) {
    return await new Promise((resolve) => {
      exec(executeCommand, (error, stdout) => {
        resolve(stdout);
      });
    })
  }
};
