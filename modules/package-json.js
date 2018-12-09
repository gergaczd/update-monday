'use strict';

const { promisify } = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const { isEmpty } = require('lodash');



module.exports = {
  async updatePackages(folder, packages) {
    if (isEmpty(packages)) { return; }

    const packageJson = await this.readPackageJson(folder);

    packages
      .filter(({ update }) => update)
      .forEach(({ name, version }) => {
        this.updateDependency(packageJson, name, version);
      });


    await this.writePackageJson(folder, packageJson);
  },

  async rollbackUpdate(folder, packages) {
    if (isEmpty(packages)) { return; }

    const packageJson = await this.readPackageJson(folder);

    packages
      .filter(({ update }) => update)
      .forEach(({ name, oldVersion }) => {
        this.updateDependency(packageJson, name, oldVersion);
      });

    await this.writePackageJson(folder, packageJson);
  },

  async readPackageJson(folder) {
    const filePath = `${folder}package.json`;
    const rawPackageJson = await readFile(filePath, 'utf8');
    return JSON.parse(rawPackageJson);
  },

  async writePackageJson(folder, packageJson) {
    const filePath = `${folder}package.json`;
    const updatedRawPackageJson = JSON.stringify(packageJson, null, 2);
    await writeFile(filePath, updatedRawPackageJson, 'utf8');
  },

  updateDependency(packageJson, name, version) {
    packageJson.dependencies[name]
      ? packageJson.dependencies[name] = version
      : packageJson.devDependencies[name] = version;
  }
};
