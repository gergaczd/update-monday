'use strict';

const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

module.exports = {
  async updatePackages(folder, packagesToUpdate) {
    if (packagesToUpdate.length === 0) {
      return;
    }

    const packageJson = require(`${__dirname}/../${folder}package.json`);

    packagesToUpdate.forEach(({ name, version }) => {
      packageJson.dependencies[name]
        ? packageJson.dependencies[name] = version
        : packageJson.devDependencies[name] = version;
    });

    await writeFile(`${folder}package.json`, JSON.stringify(packageJson, null, 2), 'utf8');
  }
};
