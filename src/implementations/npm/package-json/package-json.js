'use strict';

const fs = require('../../../../lib/async-fs');
const path = require('path');

class PackageJsonHandler {

  static create(folder) {
    return new PackageJsonHandler(folder);
  }

  constructor(folder) {
    this._folder = folder;
    this._beforeUpdateState = null;
  }

  async update(packageJson) {
    this._beforeUpdateState = await this.read();
    const formattedPackageJson = JSON.stringify(packageJson, null, 2);
    return await fs.writeFile(this.packageJsonPath, formattedPackageJson, 'utf8');
  }

  async read() {
    const rawPackageJson = await fs.readFile(this.packageJsonPath, 'utf8');

    return JSON.parse(rawPackageJson);
  }

  async restore() {
    if (!this._beforeUpdateState) {
      throw new Error('restore called before an update');
    }

    await this.update(this._beforeUpdateState);
  }

  get packageJsonPath() {
    return path.normalize(`${this._folder}/package.json`);
  }
}

module.exports = PackageJsonHandler;
