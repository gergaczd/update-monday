'use strict';

const { exec, spawn } = require('child_process');

const defaultCwd = './';

const execute = async (executeCommand, cwd = defaultCwd) => {
  return await new Promise((resolve) => {
    exec(executeCommand, { cwd }, (error, stdout) => {
      resolve(stdout);
    });
  });
};

const executeLive = async (command, cwd = defaultCwd) => {
  const [commandName, ...commandArguments] = command.split(' ');

  return new Promise((resolve, reject) => {
    const execProcess = spawn(commandName, commandArguments, { stdio: 'inherit', cwd });
    execProcess.on('close', (result) => {
      result > 0 ? reject() : resolve();
    });
  });
};

module.exports = {
  execute,
  executeLive,
  executeLiveWithResult: async (command, cwd = defaultCwd) => {
    try {
      await executeLive(command, cwd);
      return true;
    } catch (error) {
      return false;
    }
  }
};
