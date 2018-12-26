'use strict';

const store = require('../../store/store');
const prompts = require('prompts');
const { inspect } = require('util');

const inspectOptions = { colors: true, depth: null, compact: false };

module.exports = async () => {
  const packages = store.get('packages');

  const { packageName } = await prompts({
    type: 'select',
    name: 'packageName',
    message: 'Select which package history do you want to see ',
    choices: ['- show all packages -'].concat(Object.keys(packages)),
    initial: 0
  });

  console.log('This is your package history:');
  if (packages.hasOwnProperty(packageName)) {
    console.log(inspect(packages[packageName], inspectOptions));
  } else {
    console.log(inspect(packages, inspectOptions));
  }
};
