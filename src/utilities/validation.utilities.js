'use strict';

const _ = require('lodash');
const { Client } = require('../clients');

/**
 * Lodash utilities
 * @see  {@link https://lodash.com/docs/4.17.15}
 */

/**
 * @function isString
 * @description The isString function tests the passed value to see if it is a string.
 * @param  {Any} s The value to test.
 * @return {Boolean} True or false depending on if the passed value is a string
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isString = s => _.isString(s);

/**
 * @function isNumber
 * @description the isNumber function tests the passed value to see if it is a number
 * @param  {Any} n The value to test.
 * @return {Boolean} A true or false depending on if the passed value is a number.
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isNumber = n => _.isNumber(n) && _.isFinite(n) && !isString(n);

/**
 * @function hasProperty
 * @description the hasProperty function tests if the the passed object has a value
 * which is not undefined or null.
 * @param  {Object} o  The object to use when checking for a property.
 * @param  {String} property The property to test on the passed object.
 * @return {Boolean} A true or false depending on if the passed object contains the passed property.
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const hasProperty = (o, property) => _.some(o, property);

/**
 * @function isBoolean
 * @description The isBoolean function tests if the argument passed to it is a boolean.
 * @param  {Any} b The value to test.
 * @return {Boolean} A true or false depending on if the passed argument is a boolean.
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isBoolean = b => _.isBoolean(b);

/**
 * @function isDate
 * @description The isDate function tests if the passed argument is a date/
 * @param  {Any} d The value to test.
 * @return {Boolean} True or false depending on if the passed argument is a date.
 * @see  {@link isNumber}
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isDate = d => isNumber(d) || _.isDate(d) || isNumber(Date.parse(d));

/**
 * @function isBuffer
 * @description The isBuffer function tests if the argument passed to it is a buffer.
 * @param  {Any} b The value to test.
 * @return {Boolean} True or false depending on if the tested value is a buffer.
 */
const isBuffer = b => b instanceof Buffer;

/**
 * @function isObject
 * @description the isObject function tests if the argument passed to it is an object.
 * @param  {Any} o The value to test.
 * @return {Boolean} True or false depending on if the tested value is an object.
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isObject = o => _.isObject(o);

/**
 * @function isArray
 * @description The isArray function tests if the argument passed to it is an array.
 * @param  {Any} a The value to test
 * @return {Boolean} True or false depending on if the tested value is an array.
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isArray = a => _.isArray(a);

/**
 * Document utilities
 */

/**
 * @function isDocument
 * @description The isDocument function tests if the passed argument is a document.
 * @param  {Any} m The value to test
 * @return {Boolean} True or false depending on if the tested value is a document.
 */
const isDocument = m =>
  m && m.documentClass && m.documentClass() === 'document';

/**
 * @function isEmbeddedDocument
 * @description The isEmbeddedDocument function tests if the passed argument is an embedded.
 * document.
 * @param  {Any} e The value to test
 * @return {Boolean} True or false depending on if the tested value is an embedded document.
 */
const isEmbeddedDocument = e =>
  e && e.documentClass && e.documentClass() === 'embedded';

/**
 * @function isReferenceable
 * @description The isReferenceable function tests if the argument passed to it is a
 * document or a nativeId.
 * @param  {Any} r The value to test.
 * @return {Boolean} True or false depending on if the value is a document or native Id.
 * @see  {@link isDocument}
 * @see  {@link isNativeId}
 */
const isReferenceable = r => isDocument(r) || isNativeId(r);

/**
 * @function isNativeId
 * @description The isNativeId function will use the currently loaded client to
 * test if the value passed is a nativeId.
 * @param  {Any} n The value to test.
 * @return {Boolean} True or false depending on if the value is a nativeId
 */
const isNativeId = n => Client().isNativeId(n);

/**
 * @function isFunction
 * @description The isFunction function tests if the argument passed to it is a function.
 * @param  {Any} f The value to test.
 * @return {Boolean} True or false depending if the passed value is a function.
 * @see  {@link https://lodash.com/docs/4.17.15}
 * @requires lodash
 */
const isFunction = f => _.isFunction(f);

/**
 * @function isSupportedType
 * @description The isSupported type tests the argument passed to it for a type
 * @param  {Any} t The value to test.
 * @return {Boolean} True or false depending on if the type is supported.
 * @see  {@link isArray}
 */
const isSupportedType = t =>
  t === String ||
  t === Number ||
  t === Boolean ||
  t === Buffer ||
  t === Date ||
  t === Array ||
  isArray(t) ||
  t === Object ||
  typeof t.documentClass === 'function';

/**
 * @function isType
 * @description The isType function tests if the first argument passed to it is a either a
 * supported type or class. This function will first test if the second argument passed to
 * it is a string. If the second argument is a string the function will test if the value
 * is of a particular type.
 * @param  {Any} value [description]
 * @param  {String} type  [description]
 * @return {Boolean} True or false depending on if the value is of a supported type.
 * @see  {@link isString}
 * @see  {@link isNumber}
 * @see  {@link isBoolean}
 * @see  {@link isBuffer}
 * @see  {@link isDate}
 * @see  {@link isArray}
 * @see  {@link isObject}
 * @see  {@link isDocument}
 * @see  {@link isEmbeddedDocument}
 * @see  {@link isNativeId}
 */
const isType = (value, type) => {
  if (type === String || type === 'string') {
    return isString(value);
  } else if (type === Number || type === 'number') {
    return isNumber(value);
  } else if (type === Boolean || type === 'boolean') {
    return isBoolean(value);
  } else if (type === Buffer || type === 'binary') {
    return isBuffer(value);
  } else if (type === Date || type === 'date') {
    return isDate(value);
  } else if (type === Array || isArray(type) || type === 'array') {
    return isArray(value);
  } else if (type === Object || type === 'object') {
    return isObject(value);
  } else if (type.documentClass && type.documentClass() === 'document') {
    return isDocument(value) || Client().isNativeId(value);
  } else if (type.documentClass && type.documentClass() === 'embedded') {
    return isEmbeddedDocument(value);
  } else if (type && type === Client().nativeIdType()) {
    return isNativeId(value);
  } else {
    return false;
  }
};

/**
 * @function isValidType
 * @description The isValidType tests to see if the first argument value is a valid type.
 * This function also tests that the first argument is of the same type as the second
 * argument.
 * @param  {Any} value The value to test.
 * @param  {Type} type The type to test.
 * @return {Boolean}  True or false dependning on if the first argument value
 * is a valid type and of the type passed as the second argument.
 * @see  {@link isType}
 * @see  {@link isSupportedType}
 * @see  {@link isArray}
 */
const isValidType = (value, type) => {
  if (value === null) return true;

  // Issue #9: To avoid all model members being stored
  // in Client, allow undefined to be assigned. If you want
  // unassigned members in Client, use null.
  if (value === undefined) return true;

  // Arrays take a bit more work
  if (type === Array || isArray(type)) {
    // Validation for types of the form [String], [Number], etc
    if (isArray(type) && type.length > 1) {
      throw new Error(
        'Unsupported type. Only one type can be specified in arrays, but multiple found:',
        +type
      );
    }

    if (isArray(type) && type.length === 1 && isArray(value)) {
      const arrayType = type[0];
      for (let i = 0; i < value.length; i++) {
        const v = value[i];
        if (!isType(v, arrayType)) {
          return false;
        }
      }
    } else if (isArray(type) && type.length === 0 && !isArray(value)) {
      return false;
    } else if (type === Array && !isArray(value)) {
      return false;
    }

    return true;
  }
  return isType(value, type);
};

/**
 * @function isInChoices
 * @description The isInChoices function tests if the array passed as the first argument
 * contains the value passed as the second argument.
 * @param  {Array} choices An array of choices.
 * @param  {Any} choice  The value to find in the choices array.
 * @return {Boolean} True or false depending on if the choice is in choices.
 */
const isInChoices = (choices, choice) =>
  !choices ? true : choices.indexOf(choice) > -1;

/**
 * @function isEmptyValue
 * @descriptin The isEmptyValue function tests if the value passed to it is not null or
 * an empty object.
 * @param  {Any} value the value to test if empty.
 * @return {Boolean} True or false depending on if the value is empty.
 */
const isEmptyValue = value =>
  typeof value === 'undefined' ||
  (!(
    typeof value === 'number' ||
    value instanceof Date ||
    typeof value === 'boolean'
  ) &&
    0 === Object.keys(value).length);

/**
 * @module validate
 * @description A collection of internal functions to validate variables.
 * @type {Object}
 */
module.exports = {
  isString,
  isNumber,
  isBoolean,
  isDate,
  isBuffer,
  isObject,
  isArray,
  isDocument,
  isEmbeddedDocument,
  isReferenceable,
  isNativeId,
  isSupportedType,
  isType,
  isValidType,
  isInChoices,
  isEmptyValue,
  isFunction,
  hasProperty
};
