'use strict';

/* global describe before it */

const { expect } = require('chai');
const Joi = require('@hapi/joi');
const { EmbeddedDocument, Document, connect } = require('../index.js');
const { isType, isSupportedType, isValidType } = require('../src/utilities');

describe('Validation Utility Tests', () => {
  before(done => {
    connect('nedb://memory').then(db => done());
  });

  it('should throw an error if the type is unsupported', () =>
    expect(() => isType({}, null)).to.throw());

  describe('Type Detection', () => {
    const array = ['one', 'two', 'three'];
    it('should detect Arrays', () => expect(isType(array, Array)).to.be.true);
    it('should detect Embedded Documents', () => {
      class EmbeddedDoc extends EmbeddedDocument {
        constructor() {
          super();
          this.schema({});
        }
      }
      const embedded = new EmbeddedDoc();
      return expect(isType(embedded, EmbeddedDoc)).to.be.true;
    });
    it('should reject undefined', () =>
      expect(() => isType(undefined, undefined)).to.throw());
    it('should reject null', () => expect(() => isType(null, null)).to.throw);
  });

  describe('Supported Type Detection', () => {
    it('should support strings', () =>
      expect(isSupportedType(String)).to.be.true);
    it('should support numbers', () =>
      expect(isSupportedType(Number)).to.be.true);
    it('should support object', () =>
      expect(isSupportedType(Object)).to.be.true);
    it('should support Arrays', () =>
      expect(isSupportedType(Array)).to.be.true);
    it('should support booleans', () =>
      expect(isSupportedType(Boolean)).to.be.true);
    it('should support Documents', () => {
      class TestDocument extends Document {
        constructor() {
          super();
          this.schema({});
        }
      }
      const doc = new TestDocument();
      return expect(isSupportedType(doc)).to.be.true;
    });
  });
  describe('Joi Schema support', () => {
    it('should support joi strings', () =>
      expect(isValidType('string', Joi.string().type)).to.be.true);
    it('should support joi numbers', () =>
      expect(isValidType(1, Joi.number().type)).to.be.true);
    it('should support joi booleans', () =>
      expect(isValidType(true, Joi.boolean().type)).to.be.true);
    it('should support joi dates', () =>
      expect(isValidType('12/12/12', Joi.date().type)).to.be.true);
    it('should support joi arrays', () =>
      expect(isValidType([], Joi.array().type)).to.be.true);
    it('should support joi arrays', () =>
      expect(isValidType([], Joi.array().type)).to.be.true);
    it('should support joi objects', () =>
      expect(isValidType({}, Joi.object().type)).to.be.true);
    it('should support joi binary formats', () =>
      expect(isValidType(new Buffer.from('test'), Joi.binary().type)).to.be
        .true);
  });

  describe('it rejects multiple types on one property', () => {
    return expect(() => isValidType(1, [Number, String])).to.throw();
  });
});
