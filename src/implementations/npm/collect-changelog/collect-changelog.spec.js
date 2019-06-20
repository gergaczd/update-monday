'use strict';

const collectChangelog = require('./collect-changelog');
const { outdatedPackage } = require('../../../../test-config/test-helper/data-factory');
const versionHistory = require('./version-history');

describe('#collectChangelog', () => {
  it('should find the repository information for the packages', async () => {
    sinonSandbox.stub(versionHistory, 'getHistory').resolves([]);
    const packageNames = ['test-1', 'test-2'];
    const outdatedPackages = packageNames.map(
      packageName => outdatedPackage({ packageName })
    );

    await collectChangelog(outdatedPackages);

    expect(versionHistory.getHistory).to.have.been.calledWithExactly(packageNames);
  });
});
