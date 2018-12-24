'use strict';

const PackageRegistry = require('./package-registry');
const { stubDate, stubStoreMethod, createMetaInfo } = require('../test-config/helpers');

describe('PackageRegistry', () => {

  const packageName = 'testPackageName';

  describe('#registerPackage', () => {
    it('should store the under the package name key', () => {
      const setStub = stubStoreMethod('set');

      PackageRegistry.registerPackage(packageName);

      expect(setStub).to.calledWith(`packages.${packageName}`);
    });

    it('should store the meta information to the update', () => {
      const date = stubDate();
      const setStub = stubStoreMethod('set');
      const metaInformation = createMetaInfo();

      PackageRegistry.registerPackage(packageName, metaInformation);

      expect(setStub).to.calledWithExactly(
        `packages.${packageName}`,
        [{ ...metaInformation, date }]
      );
    });

    it('should not overwrite previous meta information', () => {
      const oldMetaInfo = createMetaInfo({ project: 'sample' });
      const newMetaInfo = createMetaInfo({ project: 'other' });
      const storeKey = `packages.${packageName}`;
      const date = stubDate();

      const setStub = stubStoreMethod('set');
      stubStoreMethod('has')
        .onFirstCall().returns(false)
        .onSecondCall().returns(true);
      stubStoreMethod('get').returns([{ ...oldMetaInfo, date }]);


      PackageRegistry.registerPackage(packageName, oldMetaInfo);
      PackageRegistry.registerPackage(packageName, newMetaInfo);

      expect(setStub).to.calledWithExactly(storeKey, [{ ...oldMetaInfo, date }]);
      expect(setStub).to.calledWithExactly(storeKey, [
        { ...newMetaInfo, date }, { ...oldMetaInfo, date }
      ]);
    });
  });

  describe('#getMatchingRegistration', () => {
    const oldVersion = '1.2.3';
    const olderNewVersion = '1.2.4';
    const newVersion = '1.2.5';

    it('should return empty array if there is no entry yet for package', () => {
      const currentMetaInfo = createMetaInfo();

      stubStoreMethod('has').returns(false);

      const matchingEntries = PackageRegistry
        .getMatchingRegistration(packageName, currentMetaInfo);

      expect(matchingEntries).to.deep.equal([]);
    });

    it('should return the meta if there is an exact match in versions', () => {
      const date = stubDate();
      const metaInfoToStore = createMetaInfo({ oldVersion, newVersion });
      const storedMetaInfo = { ...metaInfoToStore, date };
      const currentMetaInfo = createMetaInfo({ oldVersion, newVersion });

      stubStoreMethod('get').returns([storedMetaInfo]);
      stubStoreMethod('has').returns(true);

      const matchingEntries = PackageRegistry
        .getMatchingRegistration(packageName, currentMetaInfo);

      expect(matchingEntries).to.deep.equal([storedMetaInfo]);
    });

    it('should not return the meta if the stored new version is older', () => {
      const date = stubDate();
      const metaInfoToStore = createMetaInfo({ oldVersion, newVersion: olderNewVersion });
      const currentMetaInfo = createMetaInfo({ oldVersion, newVersion });

      stubStoreMethod('get').returns([{ ...metaInfoToStore, date }]);
      stubStoreMethod('has').returns(true);

      const matchingEntries = PackageRegistry
        .getMatchingRegistration(packageName, currentMetaInfo);

      expect(matchingEntries).to.be.empty;
    });

    it('should return the meta if the stored new version is greater', () => {
      const date = stubDate();
      const metaInfoToStore = createMetaInfo({ oldVersion, newVersion });
      const storedMetaInfo = { ...metaInfoToStore, date };
      const currentMetaInfo = createMetaInfo({ oldVersion, newVersion: olderNewVersion });

      stubStoreMethod('get').returns([storedMetaInfo]);
      stubStoreMethod('has').returns(true);

      const matchingEntries = PackageRegistry
        .getMatchingRegistration(packageName, currentMetaInfo);

      expect(matchingEntries).to.deep.equal([storedMetaInfo]);
    });
  });
});
