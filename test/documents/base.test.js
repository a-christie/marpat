'use strict';

/* global describe before beforeEach afterEach after it */

const { expect } = require('chai');
const { connect } = require('../../index');
const BaseDocument = require('../../src/base-document');

describe('Base Document', function() {
  const url = 'nedb://memory';
  let database = null;

  before(function(done) {
    connect(url)
      .then(function(db) {
        database = db;
        return database.dropDatabase();
      })
      .then(function() {
        return done();
      });
  });

  beforeEach(function(done) {
    done();
  });

  afterEach(function(done) {
    database
      .dropDatabase()
      .then(function() {})
      .then(done, done);
  });

  after(function(done) {
    database
      .dropDatabase()
      .then(function() {})
      .then(done, done);
  });

  it('should throw an error if the static documentClass is not defined', () => {
    class NewDocument extends BaseDocument {
      constructor() {
        super();
      }
    }

    expect(() => NewDocument.documentClass()).to.throw(
      'You must override documentClass (static).'
    );
  });
  it('should throw an error if the documentClass is not defined', () => {
    class TestDocument extends BaseDocument {
      constructor() {
        super();
      }
    }
    let testDocument = TestDocument.create({});
    expect(() => testDocument.documentClass()).to.throw(
      'You must override documentClass.'
    );
  });
});
