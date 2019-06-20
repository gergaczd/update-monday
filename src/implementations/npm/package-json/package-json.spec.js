'use strict';

const fs = require('../../../../lib/async-fs');
const PackageJsonHandler = require('./package-json');

describe('PackageJsonHandler', () => {
  describe('#read', () => {
    it('should read the package.json file from the given folder', async () => {
      const folder = 'test-folder/';
      const packageJson = JSON.stringify({ dependencies: {} });
      sinonSandbox.stub(fs, 'readFile').resolves(packageJson);

      const loadedPackageJson = await PackageJsonHandler.create(folder).read();

      expect(fs.readFile).to.have.been.calledWith(`${folder}package.json`);
      expect(loadedPackageJson).to.deep.equal({
        dependencies: {}
      });
    });

    it('should normalize the path for the package.json', async () => {
      const folder = 'test-folder';
      sinonSandbox.stub(fs, 'readFile').resolves('{}');

      await PackageJsonHandler.create(folder).read();

      expect(fs.readFile).to.have.been.calledWith(`${folder}/package.json`);
    });
  });

  describe('#update', () => {
    it('should update the package.json file with the given json', async () => {
      const folder = 'test-folder';
      sinonSandbox.stub(fs, 'readFile').resolves('{}');
      sinonSandbox.stub(fs, 'writeFile').resolves();

      const updatedPackageJson = { dependencies: {} };
      const formattedPackageJson = JSON.stringify(updatedPackageJson, null, 2);

      await PackageJsonHandler.create(folder).update(updatedPackageJson);

      expect(fs.writeFile).to.have.been.calledWith(`${folder}/package.json`, formattedPackageJson, 'utf8');
    });
  });

  describe('#restore', () => {
    it('should restore the state before the update when restore called', async () => {
      const folder = 'test-folder';
      const beforeUpdateVersion = JSON.stringify({ dependencies: { test: '1.0.0'} }, null, 2);
      const updatedVersion = JSON.stringify({ dependencies: { test: '2.0.0'} }, null, 2);

      sinonSandbox.stub(fs, 'readFile')
        .onFirstCall().resolves(beforeUpdateVersion)
        .onSecondCall().resolves(updatedVersion);
      sinonSandbox.stub(fs, 'writeFile').resolves();

      const packageJsonHandler = PackageJsonHandler.create(folder);

      await packageJsonHandler.update(JSON.parse(updatedVersion));

      expect(fs.readFile).to.have.been.calledBefore(fs.writeFile);

      await packageJsonHandler.restore();

      expect(fs.writeFile).to.have.been.calledTwice;
      const [firstCall, secondCall] = fs.writeFile.getCalls();

      expect(firstCall.args[1]).to.deep.equal(updatedVersion);
      expect(secondCall.args[1]).to.deep.equal(beforeUpdateVersion);
    });

    it('should throw an error if restore called without an update call before', async () => {
      const folder = 'test-folder';
      const unReachableError = new Error('should not reach this code');

      sinonSandbox.stub(fs, 'readFile').resolves('{}');
      sinonSandbox.stub(fs, 'writeFile').resolves();

      try {
        await PackageJsonHandler.create(folder).restore();
        throw unReachableError;
      } catch(error) {
        expect(error).to.not.equal(unReachableError);
        expect(error.message).to.deep.equal('restore called before an update');
      }
    });
  });
});
