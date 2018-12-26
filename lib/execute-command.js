'use strict';

const { exec, spawn } = require('child_process');

module.exports = {
  async execute(executeCommand, cwd = './') {
    return await new Promise((resolve) => {
      exec(executeCommand, { cwd }, (error, stdout) => {
        resolve(stdout);
      });
    })
  },

  async executeLive(command, cwd = './') {
    const [commandName, ...commandArguments] = command.split(' ');

    return new Promise((resolve, reject) => {
      const execProcess = spawn(commandName, commandArguments, { stdio: 'inherit', cwd });
      execProcess.on('close', (result) => {
        result > 0 ? reject() : resolve();
      });
    });
  }
};
