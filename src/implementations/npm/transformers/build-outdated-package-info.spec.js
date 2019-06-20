'use strict';

const buildOutdatedPackageInfo = require('./build-outdated-package-info');
const {
  outdatedPackage,
  link,
  oldVersion
} = require('../../../../test-config/test-helper/data-factory');

describe('#buildOutdatedPackageInfo', () => {
  it('should decorate the links into the outdated package', () => {
    const packageName = 'my-package-name';
    const links = [link('test-link')];
    const outdatedPackages = [outdatedPackage({ packageName })];
    const packageVersionsWithUrls = [{ packageName, links, versions: [] }];

    const [result] = buildOutdatedPackageInfo(outdatedPackages, packageVersionsWithUrls);

    expect(result.usefulLinks).to.equal(links);
  });

  it('should decorate the version history into the outdated package', () => {
    const packageName = 'my-package-name';
    const versions = [oldVersion('2.2.2')];
    const outdatedPackages = [outdatedPackage({ packageName })];
    const packageVersionsWithUrls = [{ packageName, versions, links: [] }];

    const [result] = buildOutdatedPackageInfo(outdatedPackages, packageVersionsWithUrls);

    expect(result.versions.history).to.equal(versions);
  });

  it('should decorate the version history with empty array if there is no history', () => {
    const outdatedPackages = [outdatedPackage({ packageName: 'my-package-name' })];
    const [result] = buildOutdatedPackageInfo(outdatedPackages, []);

    expect(result.versions.history).to.deep.equal([]);
  });

  it('should decorate the useful links with empty array if there is no links', () => {
    const outdatedPackages = [outdatedPackage({ packageName: 'my-package-name' })];
    const [result] = buildOutdatedPackageInfo(outdatedPackages, []);

    expect(result.usefulLinks).to.deep.equal([]);
  });

  it('should pair the right information to the right package', () => {
    const firstPackageName = 'first-package-name';
    const secondPackageName = 'second-package-name';
    const firstPackageVersions = [oldVersion('1.1.1')];
    const secondPackageVersions = [oldVersion('2.2.2')];
    const firstPackageLinks = [link('first-link')];
    const secondPackageLinks = [link('second-link')];
    const outdatedPackages = [
      outdatedPackage({ packageName: firstPackageName }),
      outdatedPackage({ packageName: secondPackageName })
    ];
    const packageVersionsWithUrls = [
      { packageName: firstPackageName, versions: firstPackageVersions, links: firstPackageLinks },
      { packageName: secondPackageName, versions: secondPackageVersions, links: secondPackageLinks }
    ];

    const [
      firstPackage, secondPackage
    ] = buildOutdatedPackageInfo(outdatedPackages, packageVersionsWithUrls);

    expect(firstPackage).to.containSubset({
      packageName: firstPackageName,
      versions: { history: firstPackageVersions },
      usefulLinks: firstPackageLinks
    });
    expect(secondPackage).to.containSubset({
      packageName: secondPackageName,
      versions: { history: secondPackageVersions },
      usefulLinks: secondPackageLinks
    });
  });
});
