'use strict';

/* global describe before after it */

const { expect } = require('chai');
const { connect, Client } = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Connect Capability', () => {
  describe('Ensure A Connection', () => {
    let client;
    before(done => {
      client = global.CLIENT;
      delete global.CLIENT;
      done();
    });
    after(done => {
      global.CLIENT = client;
      done();
    });
    it('should throw an error if connect is not called', done => {
      expect(() => Client()).to.throw();
      done();
    });
  });
  describe('Connect to stores', () => {
    it('should connect to an nedb connection', function() {
      return expect(connect('nedb://memory'))
        .to.eventually.be.an('object')
        .with.all.keys('_collections', '_options', '_path', '_url');
    });
    it('should connect to a mongodb connection', function() {
      return expect(connect('mongodb://127.0.0.1:27017/marpat'))
        .to.eventually.be.an('object')
        .with.all.keys('_mongo', '_client', '_url');
    });
    it('should reject if it can not connect to a mongodb connection', function() {
      return expect(
        connect('mongodb://127.0.0.1:27018/marpat').catch(error => error)
      ).to.eventually.be.an('error');
    }).timeout(35000);
    it('should reject an unrecognized connection', function() {
      return expect(
        connect('FIREBASE://memory').catch(error => error)
      ).to.eventually.be.an('error');
    });
  });
});
