'use strict';

const findChangelogForGithubRepo = require('./find-changelog-for-github-repo');
const { mockNetwork } = require('../../test-config/test-wrappers');
const nock = require('nock');
const { map } = require('lodash');

const mockRequestForFiles = (repoUrl, requests) => {
  requests.forEach(({ file, status = 200 }) => {
    nock(repoUrl).get(new RegExp(`${file}$`)).reply(status);
  });
};

describe('#findChangelogForGithubRepo', () => {
  const repoUrl = 'http://my-repo.url';
  it('should make request for the possible changelog files', mockNetwork(async () => {
    const requests = [
      { file: 'testfile1', status: 200 },
      { file: 'testfile2', status: 200 }
    ];
    mockRequestForFiles(repoUrl, requests);

    await findChangelogForGithubRepo(repoUrl, map(requests, 'file'));

    expect(nock.pendingMocks()).to.be.empty;
  }));

  it('should return with the first file which status is 200', mockNetwork(async () => {
    const requests = [
      { file: 'testfile1', status: 404 },
      { file: 'testfile2', status: 200 },
      { file: 'testfile3', status: 200 }
    ];
    mockRequestForFiles(repoUrl, requests);

    const changelogFile = await findChangelogForGithubRepo(repoUrl, map(requests, 'file'));

    expect(changelogFile).to.contains('testfile2');
  }));

  it('should fail if any of the request fails with status code above 500', mockNetwork(async () => {
    const requests = [
      { file: 'testfile1', status: 200 },
      { file: 'testfile2', status: 500 }
    ];
    mockRequestForFiles(repoUrl, requests);

    try {
      await findChangelogForGithubRepo(repoUrl, map(requests, 'file'));
    } catch (error){
      expect(error.message).to.contains('status code 500');
      return;
    }

    throw new Error('unreached code');
  }));

  it('should return with undefined if not found any reasonable changelog', mockNetwork(async () => {
    const requests = [
      { file: 'testfile1', status: 404 },
      { file: 'testfile2', status: 404 }
    ];
    mockRequestForFiles(repoUrl, requests);

    const changelogFile = await findChangelogForGithubRepo(repoUrl, map(requests, 'file'));

    expect(changelogFile).to.be.undefined;
  }));
});
