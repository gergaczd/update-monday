"use strict";

const URL = require('url');
const parse = require('github-url-from-git');

const removeSlash = (path) => path.replace(/^\//g, '');

const normalizeGithubUrl = (repo) => {
  const githubUrl = repo.includes('github.com') ? repo : 'https://github.com/' + repo;
  const parsedUrl = parse(githubUrl);

  return parsedUrl || githubUrl;
};

const getProjectFromUrl = (githubUrl) => {
  let project = URL.parse(githubUrl).pathname;
  if (!project) {
    throw new Error('that\'s no github url i know of');
  }

  return removeSlash(project);
};

module.exports = {
  changelog(options) {
    const githubUrl = normalizeGithubUrl(options.repo);
    const project = getProjectFromUrl(githubUrl);

    return {
      project: {
        github: project,
        repository: 'https://github.com/' + project
      },
      versions: options.versions || []
    };
  }
};
