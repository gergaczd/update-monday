"use strict";


const { normalizeGithubUrl, getGithubProjectFromUrl } = require('../helpers');

module.exports = (repo) => {
  const githubUrl = normalizeGithubUrl(repo);
  const project = getGithubProjectFromUrl(githubUrl);

  return 'https://github.com/' + project;
};
