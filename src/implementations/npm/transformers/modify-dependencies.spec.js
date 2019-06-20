'use strict';

const modifyDependencies = require('./modify-dependencies');
const { decoratedOutdatedPackage, versions } = require('../../../../test-config/test-helper/data-factory');

describe('#modifyDependencies', () => {
  const packageName = 'my-package';
  const current = '2.0.0';
  const latest = '3.0.0';

  const outdatedPackageUpdate = (update, packageInfo = {}) => {
    return {
      ...decoratedOutdatedPackage({
        packageName,
        versions: versions({ current, latest }),
        ...packageInfo
      }),
      update
    };
  };

  it('should upgrade version to the latest if update is true', () => {
    const packageJson = { dependencies: { [packageName]: current } };
    const outdatedPackages = [outdatedPackageUpdate(true)];

    const updatedPackageJson = modifyDependencies(packageJson, outdatedPackages);

    expect(updatedPackageJson).to.deep.equal({
      dependencies: { [packageName]: latest }
    });
  });

  it('should not upgrade version to the latest if update is false', () => {
    const packageJson = { dependencies: { [packageName]: current } };
    const outdatedPackages = [outdatedPackageUpdate(false)];

    const updatedPackageJson = modifyDependencies(packageJson, outdatedPackages);

    expect(updatedPackageJson).to.deep.equal({
      dependencies: { [packageName]: current }
    });
  });

  it('should find dependency if it is exists among devDependencies', () => {
    const packageJson = { devDependencies: { [packageName]: current } };
    const outdatedPackages = [outdatedPackageUpdate(true)];

    const updatedPackageJson = modifyDependencies(packageJson, outdatedPackages);

    expect(updatedPackageJson).to.deep.equal({
      devDependencies: { [packageName]: latest }
    });
  });

  it('should modify the given packageJson', () => {
    const packageJson = { dependencies: { [packageName]: current } };
    const outdatedPackages = [outdatedPackageUpdate(true)];

    const updatedPackageJson = modifyDependencies(packageJson, outdatedPackages);

    expect(updatedPackageJson).to.equal(packageJson);
  });

  it('should update only if the version in the package json the same as in the outdated info', () => {
    const packageJson = {
      dependencies: { 'test-dep': '2.0.0' },
      devDependencies: { 'test-dev-dep': '2.0.0' }
    };

    const outdatedPackages = [
      outdatedPackageUpdate(true, {
        packageName: 'test-dep', versions: versions({ current: '2.0.1', latest })
      }),
      outdatedPackageUpdate(true, {
        packageName: 'test-dev-dep', versions: versions({ current: '2.0.2', latest })
      })
    ];

    const updatedPackageJson = modifyDependencies(packageJson, outdatedPackages);

    expect(updatedPackageJson).to.deep.equal({
      dependencies: { 'test-dep': '2.0.0' },
      devDependencies: { 'test-dev-dep': '2.0.0' }
    });
  });
});
