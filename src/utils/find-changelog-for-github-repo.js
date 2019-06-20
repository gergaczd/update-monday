'use strict';

const { map } = require('lodash');
const axios = require('axios');

const commonChangelogFiles = [
  'History.md',
  'history.md',
  'CHANGELOG.md',
  'Changelog.md',
  'changelog.md'
];

const generateUrls = (repository, files) => files.map(file => `${repository}/blob/master/${file}`);
const makeRequestFor = (urls) => {
  return urls.map(url => axios.get(url, {
    validateStatus: status => status < 500
  }));
};

module.exports = async (repository, possibleChangelogFiles = commonChangelogFiles) => {
  const urls = generateUrls(repository, possibleChangelogFiles);
  const responses = await Promise.all(makeRequestFor(urls));
  const index = map(responses, 'status').indexOf(200);

  return urls[index];
};
