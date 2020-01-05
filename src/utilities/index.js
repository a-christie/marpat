const {
  convertQuery,
  mapValuesDeep,
  addOptionsToRef,
  addWhereToRef
} = require('./firebase.utilities');
const { deepTraverse } = require('./traversal.utilities');
const {
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
} = require('./validation.utilities');

module.exports = {
  deepTraverse,
  convertQuery,
  mapValuesDeep,
  addOptionsToRef,
  addWhereToRef,
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
