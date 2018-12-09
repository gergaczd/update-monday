'use strict';

const prompts = require('prompts');

module.exports = {
  async shouldUpdatePackage({ name, versions }) {
    const onCancel = () => true;
    const response = await prompts({
      name,
      type: 'toggle',
      message: `   ${name} from ${versions.current} -> ${versions.latest}`,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }, { onCancel });

    this._validateResponse(name, response);

    return response;
  },

  async shouldRollbackUpdate() {
    const name = 'rollback';
    const onCancel = () => true;
    const response = await prompts({
      name,
      type: 'toggle',
      message: `   The tests are failing! Do you want to revert the update`,
      initial: true,
      active: 'yes',
      inactive: 'no'
    }, { onCancel });

    this._validateResponse(name, response);

    return response[name];
  },

  _validateResponse(name, response) {
    if (!response.hasOwnProperty(name)) {
      throw new Error('user exit');
    }
  }
};
