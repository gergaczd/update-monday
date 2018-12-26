#!/usr/bin/env node
'use strict';

const { argv } = require('yargs');
const updateNotifier = require('update-notifier');
const prompts = require('prompts');
const {
  setConfig, getConfig, clearConfig, clearHistory, getHistory
} = require('./modules/config-actions');
const pkg = require('./package.json');

const options = {
  'config:set': { title: 'Set config', action: setConfig },
  'config:get': { title: 'Get config', action: getConfig },
  'config:clear': { title: 'Clear config', action: clearConfig },
  'history:get': { title: 'Get package history', action: getHistory },
  'history:clear': { title: 'Clear package history', action: clearHistory }
};

(async () => {
  const userRequestedAction = argv._;

  if(options.hasOwnProperty(userRequestedAction)) {
    await options[userRequestedAction].action();
    process.exit();
  }

  const choices = Object.entries(options).map(([value, { title }]) => {
    return { title, value };
  });
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select an action',
    choices,
    initial: 0
  });

  await options[action].action();

  updateNotifier({pkg}).notify();
  process.exit(0);
})();
