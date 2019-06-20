'use strict';

const displayPackage = require('./display');
const { decoratedOutdatedPackage, versions, link, oldVersion } = require('../../../../test-config/test-helper/data-factory');


const packageWithVersions = (providedVersions = {}) => {
  return decoratedOutdatedPackage({
    versions: versions(providedVersions)
  });
};

describe('#displayPackage', () => {
  describe('package info', () => {
    it('should display the package as the latest version of that', () => {
      const screen = sinon.stub();
      const packageInfo = decoratedOutdatedPackage({
        packageName: 'test-1',
        versions: versions({ latest: '3.0.0' })
      });

      displayPackage({ screen, outdatedPackage: packageInfo });

      expect(screen).to.have.been.calledWithMatch(`test-1@3.0.0`);
    });
  });

  describe('useful links', () => {
    it('should display the useful links', () => {
      const screen = sinon.stub();
      const usefulLinks = [
        link('TestLinkTitle', 'https://test-link.url'),
        link('FavouriteTitle', 'https://favourite.url'),
      ];

      const packageInfo = decoratedOutdatedPackage({ usefulLinks });
      displayPackage({ screen, outdatedPackage: packageInfo });

      expect(screen).to.have.been.calledWithMatch('TestLinkTitle: ');
      expect(screen).to.have.been.calledWithMatch('https://test-link.url');
      expect(screen).to.have.been.calledWithMatch('FavouriteTitle: ');
      expect(screen).to.have.been.calledWithMatch('https://favourite.url');
    });

  });

  describe('version history', () => {
    it('should display the versions in history', () => {
      const screen = sinon.stub();
      const outdatedPackage = packageWithVersions({
        current: '2.0.0',
        latest: '3.0.0',
        history: [
          oldVersion('2.1.0'),
          oldVersion('2.1.2')
        ]
      });

      displayPackage({ screen, outdatedPackage });

      expect(screen).to.have.been.calledWithMatch('2.1.0');
      expect(screen).to.have.been.calledWithMatch('2.1.2');
    });

    it('should filter out versions that are outside of the range', () => {
      const screen = sinon.stub();
      const outdatedPackage = packageWithVersions({
        current: '2.0.0',
        latest: '3.0.0',
        history: [
          oldVersion('1.0.1'),
          oldVersion('3.0.1')
        ]
      });

      displayPackage({ screen, outdatedPackage });

      expect(screen).to.not.have.been.calledWithMatch('1.0.1');
      expect(screen).to.not.have.been.calledWithMatch('3.0.1');
    });

    it('should filter out prerelease versions', () => {
      const screen = sinon.stub();
      const outdatedPackage = packageWithVersions({
        current: '2.0.0',
        latest: '3.0.0',
        history: [
          oldVersion('2.5.0-alpha.1'),
          oldVersion('3.0.0-beta.2')
        ]
      });

      displayPackage({ screen, outdatedPackage });

      expect(screen).to.not.have.been.calledWithMatch('2.5.0');
      expect(screen).to.not.have.been.calledWithMatch('3.0.0-beta.2');
    });

    it('should display humanized dates for versions', () => {
      sinonSandbox.useFakeTimers(+new Date('2018-02-02T10:00:00Z'));
      const screen = sinon.stub();
      const outdatedPackage = packageWithVersions({
        current: '2.0.0',
        latest: '3.0.0',
        history: [
          oldVersion('2.2.2', '2018-02-01T10:00:00Z'),
          oldVersion('3.0.0', '2018-02-02T09:59:59Z')
        ]
      });

      displayPackage({ screen, outdatedPackage });

      expect(screen).to.have.been.calledWithMatch('2.2.2 - 1 day ago');
      expect(screen).to.have.been.calledWithMatch('3.0.0 - less than a minute ago');
    });

    describe('tags', () => {
      it('should display current and latest tag if those versions exists in the history', () => {
        const screen = sinon.stub();
        const outdatedPackage = packageWithVersions({
          current: '2.0.0',
          latest: '3.0.0',
          history: [oldVersion('2.0.0'), oldVersion('3.0.0')]
        });
        displayPackage({ screen, outdatedPackage });

        expect(screen).to.have.been.calledWithMatch('(current)');
        expect(screen).to.have.been.calledWithMatch('(latest)');
      });

      it('should display both tag if the latest and current version matches', () => {
        const screen = sinon.stub();
        const outdatedPackage = packageWithVersions({
          current: '2.0.0',
          latest: '2.0.0',
          history: [oldVersion('2.0.0')]
        });
        displayPackage({ screen, outdatedPackage });

        expect(screen).to.have.been.calledWithMatch('(current)(latest)');
      });

      it('should not show tags if current and/or latest version missing in the history', () => {
        const screen = sinon.stub();
        const outdatedPackage = packageWithVersions({
          current: '2.0.0',
          latest: '3.0.0',
          history: [oldVersion('2.5.0')]
        });
        displayPackage({ screen, outdatedPackage });

        expect(screen).to.not.have.been.calledWithMatch('(current)');
        expect(screen).to.not.have.been.calledWithMatch('(latest)');
      });
    });
  });
});
