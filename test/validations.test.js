'use strict';

/* global describe it */

const { expect } = require('chai');
const { EmbeddedDocument, Document } = require('../index.js');
const { isType, isSupportedType, isValidType } = require('../src/utilities');

describe('Validation Utility Tests', () => {
  it('should throw an error if the type is unsupported', () =>
    expect(() => isType({}, null)).to.throw());

  describe('Type Detection', () => {
    let array = ['one', 'two', 'three'];
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
      let doc = new TestDocument();
      return expect(isSupportedType(doc)).to.be.true;
    });
  });

  describe('it rejects multiple types on one property', () => {
    return expect(() => isValidType(1, [Number, String])).to.throw();
  });
});
