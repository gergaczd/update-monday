'use strict';

process.on('unhandledRejection', () => {});
process.on('rejectionHandled', () => {});

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;


beforeEach(() => {
  global.sinonSandbox = sinon.createSandbox();
});

afterEach(() => {
  global.sinonSandbox.restore();
  delete global.sinonSandbox;
});
