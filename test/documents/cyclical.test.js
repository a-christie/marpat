'use strict';

/* global describe  beforeEach before after afterEach it */

const { expect } = require('chai');
const { connect } = require('../../index');
const { validateId } = require('./../util');
const { Foo, Bar } = require('../mocks');

describe('Cyclical Dependencies', function() {
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

  describe('schema', function() {
    it('should allow cyclic dependencies', function(done) {
      let f = Foo.create();
      f.num = 26;
      let b = Bar.create();
      b.num = 99;

      f
        .save()
        .then(function(foo) {
          b.foo = foo;
          return b.save();
        })
        .then(function(bar) {
          f.bar = b;
          return f.save();
        })
        .then(function(foo) {
          return Foo.findOne({ num: 26 });
        })
        .then(function(foo) {
          validateId(foo);
          validateId(foo.bar);
          expect(foo.num).to.be.equal(26);
          expect(foo.bar.num).to.be.equal(99);
          return Bar.findOne({ num: 99 });
        })
        .then(function(bar) {
          validateId(bar);
          validateId(bar.foo);
          expect(bar.num).to.be.equal(99);
          expect(bar.foo.num).to.be.equal(26);
        })
        .then(done, done);
    });
  });
});
