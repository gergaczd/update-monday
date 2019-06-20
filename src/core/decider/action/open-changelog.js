'use strict';

const browser = require('../../../../lib/browser');
const { first, isUndefined } = require('lodash');

module.exports = (links) => {
  const linkCandidates = [
    links.find(({ name }) => name === 'Changelog'),
    links.find(({ name }) => name === 'Release')
  ].filter(link => !isUndefined(link));

  const linkToOpen = first(linkCandidates);

  linkToOpen && browser.openUrl(linkToOpen.url);
};
