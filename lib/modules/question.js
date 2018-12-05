'use strict';

const prompts = require('prompts');

module.exports = async ({ name, versions }) => {
  const response = await prompts({
    name,
    type: 'toggle',
    message: `   ${name} from ${versions.current} -> ${versions.latest}`,
    initial: true,
    active: 'yes',
    inactive: 'no'
  }, {
    onCancel: () => true
  });

  if (!response.hasOwnProperty(name)) {
    throw new Error('user exit');
  }

  return response;
};
