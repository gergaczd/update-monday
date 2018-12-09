'use strict';

const { exec } = require('child_process');

module.exports = {
  async execute(executeCommand) {
    return await new Promise((resolve) => {
      exec(executeCommand, (error, stdout) => {
        resolve(stdout);
      });
    })
  },

  async executeLive(executeCommand) {
    return new Promise((resolve, reject) => {
      const execProcess = exec(executeCommand);
      execProcess.on('exit', (result) => {
        result > 0 ? reject() : resolve();
      });
      execProcess.stdout.pipe(process.stdout);
    });
  }
};
