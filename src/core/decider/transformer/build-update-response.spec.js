'use strict';

const buildUpdateResponse = require('./build-update-response');
const { decoratedOutdatedPackage } = require('../../../../test-config/test-helper/data-factory');

describe('#buildUpdateResponse', () => {
  it('should enhance the input with the update result', () => {
    const outdatedPackages = [
      decoratedOutdatedPackage({ packageName: 'test-1' }),
      decoratedOutdatedPackage({ packageName: 'test-2' })
    ];

    const updateResults = {
      'test-1': true,
      'test-2': false
    };

    const result = buildUpdateResponse(outdatedPackages, updateResults);

    expect(result).to.deep.equal([
      { ...outdatedPackages[0], update: true },
      { ...outdatedPackages[1], update: false }
    ]);
  });

  it('should not include update results which does not have an outdatedPackage', () => {
    const outdatedPackages = [
      decoratedOutdatedPackage({ packageName: 'test-1' }),
    ];

    const updateResults = {
      'test-1': true,
      'test-2': false
    };

    const result = buildUpdateResponse(outdatedPackages, updateResults);

    expect(result).to.deep.equal([
      { ...outdatedPackages[0], update: true }
    ]);
  });

  it('should make update result false by default if not provided for the package', () => {
    const outdatedPackages = [
      decoratedOutdatedPackage({ packageName: 'test-1' }),
    ];
    const updateResults = {};

    const result = buildUpdateResponse(outdatedPackages, updateResults);

    expect(result).to.deep.equal([
      { ...outdatedPackages[0], update: false }
    ]);
  });
});
