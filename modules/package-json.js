'use strict';

const { promisify } = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

module.exports = {
  async updatePackages(folder, packages) {
    const filePath = `${folder}package.json`;
    if (packages.length === 0) {
      return;
    }

    const rawPackageJson = await readFile(filePath, 'utf8');
    const packageJson = JSON.parse(rawPackageJson);

    packages
      .filter(({ update }) => update)
      .forEach(({ name, version }) => {
        packageJson.dependencies[name]
          ? packageJson.dependencies[name] = version
          : packageJson.devDependencies[name] = version;
      });

    const updatedRawPackageJson = JSON.stringify(packageJson, null, 2);
    await writeFile(filePath, updatedRawPackageJson, 'utf8');
  }
};
