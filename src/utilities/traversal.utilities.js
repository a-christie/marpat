'use strict';

const _ = require('lodash');

const deepMapValues = (obj, fn) =>
	_.mapValues(obj, (val, key) =>
		_.isPlainObject(val) ? deepMapValues(val, fn) : fn(val, key, obj)
	);

/**
 * @function deepTraverse
 * @description The deepTraverse function walk through each property of the object
 * passed to it and calls the passed function as if the function were a method of
 * the passed object
 * @param  {Object} obj The object to traverse
 * @param  {Function} func The function to apply to the object.
 */
const deepTraverse = (obj, func) => {
	for (const prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			/* eslint-disable-next-line no-invalid-this */
			func.apply(this, [prop, obj[prop], obj]);
			if (obj[prop] !== null && typeof obj[prop] == 'object') {
				deepTraverse(obj[prop], func);
			}
		}
	}
};

module.exports = { deepMapValues, deepTraverse };
