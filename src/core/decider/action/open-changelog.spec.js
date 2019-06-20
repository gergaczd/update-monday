'use strict';

const openChangelog = require('./open-changelog');
const { link } = require('../../../../test-config/test-helper/data-factory');
const browser = require('../../../../lib/browser');

describe('#openChangelog', () => {

  it('should not open anything if no link provided', () => {
    sinonSandbox.stub(browser, 'openUrl');

    openChangelog([]);

    expect(browser.openUrl).to.not.have.been.called;
  });

  it('should open the given link', () => {
    sinonSandbox.stub(browser, 'openUrl');
    const changelogUrl = 'https://changelog.url';

    openChangelog([
      link('Changelog', changelogUrl)
    ]);

    expect(browser.openUrl).to.have.been.calledWithExactly(changelogUrl);
  });

  it('should not open if Changelog link not exists', () => {
    sinonSandbox.stub(browser, 'openUrl');

    openChangelog([
      link('Non-Changelog', 'https://non-changelog.url')
    ]);

    expect(browser.openUrl).to.not.have.been.called;
  });

  it('should fall back to Release link if no Changelog url', () => {
    sinonSandbox.stub(browser, 'openUrl');
    const releaseUrl = 'https://release.url';

    openChangelog([
      link('Non-Changelog', 'https://notchangelog.url'),
      link('Release', releaseUrl)
    ]);

    expect(browser.openUrl).to.have.been.calledWithExactly(releaseUrl);
  });

  it('should open Changelog url if both Changelog and Release url exists', () => {
    sinonSandbox.stub(browser, 'openUrl');
    const releaseUrl = 'https://release.url';
    const changelogUrl = 'https://changelog.url';

    openChangelog([
      link('Changelog', changelogUrl),
      link('Release', releaseUrl)
    ]);

    expect(browser.openUrl)
      .to.have.been.calledWithExactly(changelogUrl)
      .and.to.not.have.been.calledWithExactly(releaseUrl);
  });
});
