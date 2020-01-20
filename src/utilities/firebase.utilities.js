const _ = require('lodash');
const flatten = require('flat');

const addWhereToRef = (ref, where) => {
  if (!Array.isArray(where)) {
    throw new Error('where parameter must be an array.');
  }

  if (Array.isArray(where[0])) {
    return where.reduce((acc, whereArgs) => addWhereToRef(acc, whereArgs), ref);
  }
  return ref.where(...where);
};

const addOptionsToRef = (ref, options) => {
  if (options.offset) {
    ref.startAt(offset);
  }

  if (options.limit) {
    ref.limit(options.limit);
  }

  return ref.where(...where);
};

const mapValuesDeep = (obj, fn) =>
  _.mapValues(obj, (val, key) =>
    _.isPlainObject(val) ? mapValuesDeep(val, fn) : fn(val, key, obj)
  );

const convertQuery = query => {
  const queries = [];
  const ids = [];

  if (Array.isArray(query)) {
    queries.push(query);
  } else {
    mapValuesDeep(flatten(query), (value, key, obj) => {
      if (key === '_id') {
        ids.push(value);
      } else if (key.includes('$in')) {
        const parent = key.split('$in')[0].replace('.', '');
        if (parent === '_id') {
          if (Array.isArray(value)) {
            value.forEach(value => ids.push(value));
          } else {
            ids.push(value);
          }
        } else if (Array.isArray(value)) {
          value.map(query => [parent, '==', value]);
          queries.push(value);
        } else {
          queries.push([parent, '==', value]);
        }
      }
    });
  }

  return { queries, ids };
};

module.exports = {
  convertQuery,
  mapValuesDeep,
  addOptionsToRef,
  addWhereToRef
};
