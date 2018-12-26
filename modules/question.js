'use strict';

const prompts = require('prompts');

module.exports = {
  async shouldUpdatePackage({ name, versions }) {
    const message = `   ${name} from ${versions.current} -> ${versions.latest}`;
    return await this._togglePrompt({ name, message });
  },

  async shouldRollbackUpdate() {
    const message = `   Do you want to revert the update`;
    return await this._getToggleResult({ message });
  },

  async shouldRunTestsAgain() {
    const message = `   Tests are failing! Do you want to run tests again`;
    return await this._getToggleResult({ message, initial: false });
  },

  async shouldStorePackageUpdateByDefault({ initial = false } = {}) {
    const message = 'Store package updates by default';
    return await this._getToggleResult({ message, initial });
  },

  async shouldInstallPackagesByDefault({ initial = false } = {}) {
    const message = 'Install packages after update by default';
    return await this._getToggleResult({ message, initial });
  },

  async shouldOpenChangelogByDefault({ initial = false } = {}) {
    const message = 'Open changelog in browser by default';
    return await this._getToggleResult({ message, initial });
  },

  async shouldRunTestsByDefault({ initial = false } = {}) {
    const message = 'Run tests after installing packages by default';
    return await this._getToggleResult({ message, initial });
  },

  async _getToggleResult(options = {}) {
    const { question } = await this._togglePrompt({ ...options, name: 'question' });
    return question;
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
