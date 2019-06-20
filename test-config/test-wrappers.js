'use strict';

const nock = require('nock');

module.exports = {
  mockNetwork(testFunction) {
     return async () => {
       nock.cleanAll();
       try {
         await testFunction();
       } finally {
         nock.cleanAll();
       }
     };
  }
};
