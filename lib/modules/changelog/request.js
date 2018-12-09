'use strict';

const changelog = require('./generate/changelog');
const axios = require('axios');

const arrayToObject = (array) => {
  return array.reduce((acc, value) => {
      return { ...acc, ...value };
    }, {});
};

const commonChangelogFiles = [
  'History.md', 'history.md', 'CHANGELOG.md', 'Changelog.md', 'changelog.md'
];

module.exports = {
  async getVersionHistories(packages) {
    const changelogRequests = packages
      .map(({ name }) => changelog.generate(name));
    const changelogs = await Promise.all(changelogRequests);

    const changelogWithNames = packages
      .map(({ name }, index) => {
        return { [name]: changelogs[index] };
      });

    return arrayToObject(changelogWithNames);
  },

  async getChangelogFile(repository) {
    const urls = this._getPossibleChangelogUrlsForRepository(repository);

    const option = { validateStatus(status) { return status < 500; } };
    const responses = await Promise.all(urls.map(url => axios.get(url, option)));
    const index = responses.map(response => response.status).indexOf(200);

    return urls[index];
  },

  _getPossibleChangelogUrlsForRepository(repository) {
    const baseUrl = `${repository}/blob/master/`;
    return commonChangelogFiles.map(file => `${baseUrl}${file}`);
  }
};
