'use strict';

const PackageRegistry = require('../store/package-registry');
const { transformForMatchingRegistrationCheck } = require('../lib/transformer');
const { distanceInWordsToNow } = require('date-fns');
const format = require('../lib/display-fomat');


module.exports = {
  showUpdateHistoryForPackage(packageInfo, projectName) {
    const packageMetaInfo = transformForMatchingRegistrationCheck(packageInfo);
    const registrations = PackageRegistry.getMatchingRegistration(packageInfo.name, packageMetaInfo);

    console.log('\n');

    registrations.forEach(({ project, oldVersion, newVersion, date, update }) => {
      const relativeTime = distanceInWordsToNow(new Date(date));
      const updated = update ? format.green('Updated') : format.red('Not updated');

      const displayedProject = project === projectName ? format.italic('this') : project;

      const updateDetails = format.version(`- ${relativeTime} ago in ${displayedProject} project`);
      console.log(`   - ${updated} (${oldVersion} -> ${newVersion}) ${updateDetails}`);
    });
  }
};
