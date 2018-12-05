'use strict';

const { promisify } = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

module.exports = {
  async updatePackages(folder, packages) {
    if (packages.length === 0) {
      return;
    }

    const packageJson = JSON.parse(await readFile(`${folder}package.json`, 'utf8'));

    packages
      .filter(({ update }) => update)
      .forEach(({ name, version }) => {
        packageJson.dependencies[name]
          ? packageJson.dependencies[name] = version
          : packageJson.devDependencies[name] = version;
      });

    await writeFile(`${folder}package.json`, JSON.stringify(packageJson, null, 2), 'utf8');
  }
};
