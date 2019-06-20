const buildOutdatedPackages = require('./build-outdated-packages');


describe('#buildOutdatedPackages', () => {
  it('should return with an empty array if the outdated output is empty string', () => {
    const outdatedPackages = buildOutdatedPackages('');
    expect(outdatedPackages).to.deep.equal([]);
  });

  it('should contain the name of the package in an array from the outdated output', () => {
    const outdatedOutput = JSON.stringify({
      myPackageName: {
        current: '1.2.3',
        latest: '3.4.5',
        wanted: '2.3.4',
        location: 'node_modules/packageName'
      }
    });

    const outdatedPackages = buildOutdatedPackages(outdatedOutput);

    expect(outdatedPackages).to.containSubset([{ packageName: 'myPackageName' }]);
  });

  it('should contain only the current and latest version under the versions key', () => {
    const outdatedOutput = JSON.stringify({
      myPackageName: {
        current: '1.2.3',
        latest: '3.4.5',
        wanted: '2.3.4',
        location: 'node_modules/packageName'
      }
    });

    const [outdatedPackage] = buildOutdatedPackages(outdatedOutput);

    expect(outdatedPackage.versions).to.deep.equal({
      current: '1.2.3',
      latest: '3.4.5'
    });
  });

  it('should generate an entry for each package', () => {
    const outdatedOutput = JSON.stringify({
      myPackageName: { current: '1', latest: '2' },
      otherPackageName: { current: '2', latest: '3' }
    });

    const outdatedPackages = buildOutdatedPackages(outdatedOutput);

    expect(outdatedPackages).to.deep.equal([
      { packageName: 'myPackageName', versions: { current: '1', latest: '2' } },
      { packageName: 'otherPackageName', versions: { current: '2', latest: '3' } }
    ]);
  });
});
