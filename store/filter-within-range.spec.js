'use strict';

const filterWithinRange = require('./filter-within-range');


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

  describe('new version', () => {
    it('should not return the versions which new version is smaller than the given one', () => {
      const olderNewVersion = '1.2.2';
      const versionsToMatch = [{ newVersion: olderNewVersion, oldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal([]);
    });

    it('should return the versions which new version is greater than the given one', () => {
      const newerNewVersion = '1.2.8';
      const versionsToMatch = [{ newVersion: newerNewVersion, oldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal(versionsToMatch);
    });
  });

  describe('old version', () => {
    it('should not return the versions which old version is greater than the given one', () => {
      const newerOldVersion = '1.2.2';
      const versionsToMatch = [{ newVersion, oldVersion: newerOldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal([]);
    });

    it('should return the versions which old version is smaller than the given one', () => {
      const olderOldVersion = '1.1.1';
      const versionsToMatch = [{ newVersion, oldVersion: olderOldVersion }];

      const result = filterWithinRange(versions, versionsToMatch);

      expect(result).to.deep.equal(versionsToMatch);
    });
  });
});
