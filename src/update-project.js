'use strict';

const createCollector = require('./core/collector/collector');
const createDecider = require('./core/decider/decider');
const createUpdater = require('./core/updater/updater');
const createImplementation = require('./implementations');

const createUpdaterStrategies = ({ flags, projectFolder }) => {
  const implementation = createImplementation('npm', projectFolder);

  return {
    collect: createCollector({ implementation }),
    decide: createDecider({ flags }),
    update: createUpdater({ flags, implementation })
  };
};

module.exports = async (projectFolder, flags) => {
  const { collect, decide, update } = createUpdaterStrategies({ flags, projectFolder });

  const outdatedInformation = await collect();
  const decisions = await decide(outdatedInformation);
  await update(decisions);


  store()
};

