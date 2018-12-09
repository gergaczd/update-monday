"use strict";

const semver = require('semver');
const axios = require('axios');
const { omit } = require('lodash');

const sortDate = (a, b) => {
  if (a.date < b.date) return 1;
  if (a.date > b.date) return -1;
  return 0;
};

const findRepoUrl = (data) => {
  let repo = '';
  ['repository', 'repositories', 'bugs', 'licenses'].forEach((branch) => {
    if (repo || !data[branch]) return;
    let repoTree = data[branch];

    repo = repoTree.url;
    if (!repo && repoTree.length) {
      repoTree = repoTree[0];
      repo = repoTree.url;
    }
  });
  return repo;
};

const findRepoRecursively = (data) => {
  let repo = findRepoUrl(data);

  if (!repo && data.versions) {
    Object.keys(data.versions).forEach((version) => {
      if (!repo) {
        repo = findRepoUrl(data.versions[version]);
      }
    });
  }

  return repo;
};

const hasRepoUrl = (data) => !!findRepoRecursively(data);

const validateResponse = (data, url, moduleName) => {
  if (!data) throw new Error(`No data for ${url}`);
  if (data.error === 'not_found') throw new Error(`Npm module ${moduleName} was not found.`);
  if (!data.time) throw new Error(`No published versions for ${moduleName}`);

  if (!hasRepoUrl(data)) {
    throw new Error(`The module's owner did not specify the repository url in the package.json for ${moduleName}.`);
  }
};

module.exports = {
  async packageHistory(moduleName) {
    const url = 'http://registry.npmjs.org/' + moduleName.replace('/', '%2F');
    const { data } = await axios.get(url);

    validateResponse(data, url, moduleName);

    const repo = findRepoRecursively(data);

    const time = omit(data.time, ['created', 'modified']);

    const versions = Object.keys(time)
      .filter((version) => semver.valid(version))
      .map((version) => {
        return { version, date: new Date(time[version]) };
      })
      .sort(sortDate);

    return { repo, versions };
  }
};
