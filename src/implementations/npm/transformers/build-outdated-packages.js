'use strict';

module.exports = (outdatedOutput) => {
  const packages = outdatedOutput.length > 0 ? JSON.parse(outdatedOutput) : {};

  return Object.entries(packages).map(([packageName, versions]) => {
    return {
      packageName,
      versions: {
        current: versions.current,
        latest: versions.latest
      }
    };
  })
};
