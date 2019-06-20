'use strict';

const { get } = require('lodash');
const URL = require('url');
const parse = require('github-url-from-git');

const removeSlash = (path) => path.replace(/^\//g, '');

module.exports = {
  arrayToObject(array) {
    return array.reduce((acc, value) => {
      return { ...acc, ...value };
    }, {});
  },

  isGithubDomain(uri){
    return /github.com/.test(uri);
  },

  removeGitExtension(uri) {
    return uri.replace(/\.git$/, '');
  },

  getGithubRepository(uri) {
    const result = uri.match(/github\.com\/([^\/]*\/[^\/]*)/);
    return get(result, '1', undefined);
  },

  isNotNpmPackage(uri) {
    // Scoped npm packages start with an '@' and include a forward slash
    return uri[0] !== '@' && uri.split('/').length === 2;
  },

  normalizeGithubUrl(uri) {
    const githubUrl = uri.includes('github.com') ? uri : 'https://github.com/' + uri;
    const parsedUrl = parse(githubUrl);

    return parsedUrl || githubUrl;
  },

  getGithubProjectFromUrl(uri) {
    let project = URL.parse(uri).pathname;
    if (!project) {
      throw new Error('that\'s no github url i know of');
    }

    return removeSlash(project);
  }
};
