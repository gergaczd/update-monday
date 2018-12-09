"use strict";

const npm = require('./datasrc/npm');
const github = require('./datasrc/github');
const { get } = require('lodash');

const isGithubDomain = (projectUrl) => /github.com/.test(projectUrl);
const removeGitExtension = (repository) => repository.replace(/\.git$/, '');
const getGithubRepository = (projectUrl) => {
  const result = projectUrl.match(/github\.com\/([^\/]*\/[^\/]*)/);
  return get(result, '1', undefined);
};
const isNotNpmPackage = (projectUrl) => {
  // Scoped npm packages start with an '@' and include a forward slash
  return projectUrl[0] !== '@' && projectUrl.split('/').length === 2;
};

module.exports = {
  generate(project) {
    if (isGithubDomain(project)) {
      const repo = getGithubRepository(project);
      if (!repo) {
        throw new Error('Bad repo url: ' + project);
      }

      return github.changelog({ repo: removeGitExtension(repo) });
    }

    if (isNotNpmPackage(project)) {
      return github.changelog({ repo: project });
    }

    return npm.packageHistory(project)
      .then(data => github.changelog(data));
  }
};
