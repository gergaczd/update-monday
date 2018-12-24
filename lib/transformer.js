'use strict';

module.exports = {
  transformUpdatesForRegistry(project, allUpdateInfo) {
    return allUpdateInfo.map((updateInfo) => {
      return {
        project,
        packageName: updateInfo.name,
        oldVersion: updateInfo.oldVersion,
        newVersion: updateInfo.version,
        update: updateInfo.update
      };
    });
  },

  transformForMatchingRegistrationCheck(packageMetaInfo) {
    return {
      packageName: packageMetaInfo.name,
      oldVersion: packageMetaInfo.versions.current,
      newVersion: packageMetaInfo.versions.latest
    };
  }
};
