'use strict';

const createDecider = require('./decider');
const { mockPromptResponse, stubPromptToggle } = require('../../../test-config/test-helper/test-helper');
const { decoratedOutdatedPackage, outdatedPackageWithUpdate, link } = require('../../../test-config/test-helper/data-factory');
const browser = require('../../../lib/browser');


describe('Decider', () => {

  beforeEach(() => sinonSandbox.stub(console, 'log'));

  it('should ask question about the given packages', async () => {
    const promptStub = stubPromptToggle();
    const decide = createDecider({ flags: {} });
    const outdatedPackages = [
      decoratedOutdatedPackage({ packageName: 'test-1' }),
      decoratedOutdatedPackage({ packageName: 'test-2' })
    ];

    await decide(outdatedPackages);

    expect(promptStub).to.have.been.calledTwice;
    const [firstCall, secondCall] = promptStub.getCalls();

    expect(firstCall.args[0].message).to.contains('test-1');
    expect(secondCall.args[0].message).to.contains('test-2');
  });

  it('should return with the update info about the packages', async () => {
    mockPromptResponse({ id: 'test-1', result: true });
    mockPromptResponse({ id: 'test-2', result: false });

    const decide = createDecider({ flags: {} });
    const outdatedPackages = [
      decoratedOutdatedPackage({ packageName: 'test-1' }),
      decoratedOutdatedPackage({ packageName: 'test-2' })
    ];

    const expectedResult = [
      outdatedPackageWithUpdate({ packageName: 'test-1', update: true }),
      outdatedPackageWithUpdate({ packageName: 'test-2', update: false })
    ];

    const result = await decide(outdatedPackages);

    expect(result).to.deep.equal(expectedResult);
  });

  it('should open url if url provided and has open flag', async () => {
    mockPromptResponse({ id: 'test-1', result: true });
    sinonSandbox.stub(browser, 'openUrl');

    const decide = createDecider({ flags: { open: true } });
    const changelogUrl = 'http://test.url';
    const outdatedPackages = [
      decoratedOutdatedPackage({
        packageName: 'test-1',
        usefulLinks: [link('Changelog', changelogUrl)]
      })
    ];

    await decide(outdatedPackages);

    expect(browser.openUrl).to.have.been.calledWithExactly(changelogUrl);
  });

  it('should not open url if url provided but has no open flag', async () => {
    mockPromptResponse({ id: 'test-1', result: true });
    sinonSandbox.stub(browser, 'openUrl');

    const decide = createDecider({ flags: {} });
    const outdatedPackages = [
      decoratedOutdatedPackage({
        packageName: 'test-1',
        usefulLinks: [link('Changelog', 'http://test.url')]
      })
    ];

    await decide(outdatedPackages);

    expect(browser.openUrl).to.not.have.been.called;
  });
});
