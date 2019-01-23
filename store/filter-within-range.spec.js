'use strict';

const filterWithinRange = require('./filter-within-range');

//old < new *
//new < old *
// * means versions from history
// so return true if there is any intersect
describe('#filterWithinRange', () => {
  const newVersion = '1.2.3';
  const oldVersion = '1.2.0';
  const versions = Object.freeze({ newVersion, oldVersion });

  it('should return empty array if there is nothing to match against', () => {
    const result = filterWithinRange(versions, []);

    expect(result).to.deep.equal([]);
  });

  it('should return the version to match against if it contains the same range', () => {
    const versionsToMatch = [{ newVersion, oldVersion }];

    const result = filterWithinRange(versions, versionsToMatch);

    expect(result).to.deep.equal(versionsToMatch);
  });

  it('should not return the versions which does not have any intersect with the given one', () => {
    const versionsToMatch = [
      { oldVersion: '1.0.0', newVersion: '1.1.1' },
      { oldVersion: '1.0.0', newVersion: oldVersion },
      { oldVersion: '1.3.0', newVersion: '1.4.0' }
    ];

    const result = filterWithinRange(versions, versionsToMatch);

    expect(result).to.deep.equal([]);
  });

  it('should return with the version which old version is the same as given new one', () => {
    const versionsToMatch = [{ oldVersion: newVersion, newVersion: '1.4.0' }];

    const result = filterWithinRange(versions, versionsToMatch);

    expect(result).to.deep.equal(versionsToMatch);
  });

  describe('new version', () => {
    it('should return the versions which new version is smaller than the given one and the old one is same', () => {
      const olderNewVersion = '1.2.2';
      const versionsToMatch = [{ newVersion: olderNewVersion, oldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal(versionsToMatch);
    });

    it('should return the versions which new version is greater than the given one', () => {
      const newerNewVersion = '1.2.8';
      const versionsToMatch = [{ newVersion: newerNewVersion, oldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal(versionsToMatch);
    });
  });

  describe('old version', () => {
    it('should return the versions which old version is greater than the given one and the new one is same', () => {
      const newerOldVersion = '1.2.2';
      const versionsToMatch = [{ newVersion, oldVersion: newerOldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal(versionsToMatch);
    });

    it('should return the versions which old version is smaller than the given one', () => {
      const olderOldVersion = '1.1.1';
      const versionsToMatch = [{ newVersion, oldVersion: olderOldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal(versionsToMatch);
    });
  });
});
