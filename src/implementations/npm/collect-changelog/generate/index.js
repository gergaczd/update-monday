"use strict";

const npm = require('./npm');
const buildGithubUrlFromRepo = require('./build-github-url-from-repo');
const {
  isGithubDomain, removeGitExtension, getGithubRepository, isNotNpmPackage
} = require('../helpers');

const getRepositoryUrl = (project) => {
  if (isGithubDomain(project)) {
    const repo = getGithubRepository(project);
    if (!repo) throw new Error('Bad repo url: ' + project);

    return buildGithubUrlFromRepo(removeGitExtension(repo));
  }

  return buildGithubUrlFromRepo(project);
};

module.exports = async (project) => {
  if (isGithubDomain(project) || isNotNpmPackage(project)) {
    return {
      links: [
        { name: 'Repository', url: getRepositoryUrl(project) }
      ],
      versions: []
    }
  }

  const { repo, versions } = await npm.packageHistory(project);
  return {
    links: [
      { name: 'Repository', url: buildGithubUrlFromRepo(repo) }
    ],
    versions
  };
};
