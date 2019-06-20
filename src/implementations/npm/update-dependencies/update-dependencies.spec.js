'use strict';

const updateDependencies = require('./update-dependencies');
const { versions, outdatedPackageWithUpdate } = require('../../../../test-config/test-helper/data-factory');

describe('#updateDependencies', () => {
  const packageName = 'my-package';
  const currentVersion = '5.3.0';
  const newVersion = '5.5.5';

  it('should update the current package json with the modified one', async () => {
    const decisionResult = outdatedPackageWithUpdate({
      packageName,
      versions: versions({ current: currentVersion, latest: newVersion }),
      update: true
    });

    const oldPackageJson = { dependencies: { [packageName]: currentVersion } };
    const expectedNewPackageJson = { dependencies: { [packageName]: newVersion } };

    const mockedPackageJsonHandler = {
      read: sinon.stub().resolves(oldPackageJson),
      update: sinon.stub().resolves()
    };

    await updateDependencies(mockedPackageJsonHandler, [decisionResult]);

    expect(mockedPackageJsonHandler.update).to.have.been.calledWithExactly(expectedNewPackageJson);
  });
});
