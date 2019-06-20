'use strict';

const createCollector = require('./collector');
const { createImplementationMock } = require('../../../test-config/test-helper/test-helper');
const { outdatedPackage, decoratedOutdatedPackage } = require('../../../test-config/test-helper/data-factory');
const stepMaker = require('../../../lib/step-marker');

describe('Collector', () => {

  beforeEach(() => {
    sinonSandbox.stub(stepMaker);
    sinonSandbox.stub(console, 'table');
  });

  it('should collect outdated packages', async () => {
    const implementation = createImplementationMock();

    await createCollector({ implementation })();

    expect(implementation.getOutdatedPackages).to.have.been.called;
  });

  it('should collect changelog with the outdated packages', async () => {
    const implementation = createImplementationMock();
    const outdatedPackages = [
      outdatedPackage({ packageName: 'test-1' }),
      outdatedPackage({ packageName: 'test-2'})
    ];
    implementation.getOutdatedPackages.resolves(outdatedPackages);

    await createCollector({ implementation })();

    expect(implementation.collectChangelog).to.have.been.calledWithExactly(outdatedPackages);
  });

  it('should return with the collected changelog', async () => {
    const implementation = createImplementationMock();
    const packagesWithCollectedChangelog = [
      decoratedOutdatedPackage({})
    ];

    implementation.collectChangelog.resolves(packagesWithCollectedChangelog);

    const collected = await createCollector({ implementation })();

    expect(collected).to.deep.equal(packagesWithCollectedChangelog);
  });
});
