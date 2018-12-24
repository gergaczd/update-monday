'use strict';

const prompts = require('prompts');

module.exports = {
  async shouldUpdatePackage({ name, versions }) {
    const message = `   ${name} from ${versions.current} -> ${versions.latest}`;
    return await this._togglePrompt({ name, message });
  },

  async shouldRollbackUpdate() {
    const name = 'rollback';
    const message = `   Do you want to revert the update`;
    const response = await this._togglePrompt({ name, message });

    return response[name];
  },

  async shouldRunTestsAgain() {
    const name = 'runAgain';
    const message = `   Tests are failing! Do you want to run tests again`;
    const response = await this._togglePrompt({ name, message, initial: false });

    return response[name];
  },

  async _togglePrompt(options = {}) {
    const promptOptions = {
      type: 'toggle',
      initial: true,
      active: 'yes',
      inactive: 'no',
      ...options
    };

    const response = await prompts(promptOptions, { onCancel: () => true });
    this._validateResponse(promptOptions.name, response);

    return response;
  },

  _validateResponse(name, response) {
    if (!response.hasOwnProperty(name)) {
      throw new Error('user exit');
    }
  }
};
