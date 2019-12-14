'use strict';

const _ = require('lodash');
const { MongoClient, ObjectId } = require('mongodb');
const DatabaseClient = require('./client');
const { isObject } = require('../validate');
const { deepTraverse } = require('../util');

/**
 * @class MongoDbClient
 * @classdesc The class used to integrate with Mongodb
 */
class MongoDbClient extends DatabaseClient {
  /** @constructs
   * @param {String} url The mongodb connection url.
   * @param {Object} mongo The mongo instance.
   * @param {Object} client The connection client.
   */
  constructor(url, mongo, client) {
    super(url);
    this._client = client;
    this._mongo = mongo;
  }

  /**
   * @method canHandle
   * @description tests a given url to see if the client can handle connection.
   * @param {String} url The url to test.
   * @return {Promise} Promise with result insert or update query
   */
  static canHandle(url) {
    return typeof url.indexOf === 'function' && url.indexOf('mongodb') === 0;
  }

  /**
   * @method save
   * @description Save (upsert) document
   * @param {String} collection Collection's name
   * @param {ObjectId?} id Document's id
   * @param {Object} values Data for save
   * @return {Promise} Promise with result insert or update query
   */
  save(collection, id, values) {
    const that = this;
    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);

      if (id === null) {
        db.insertOne(values, function(error, result) {
          if (error) return reject(error);
          return resolve(result.insertedId);
        });
      } else {
        db.updateOne(
          { _id: id },
          { $set: values },
          { upsert: true },
          (error, result) => {
            if (error) return reject(error);
            return resolve();
          }
        );
      }
    });
  }

  /**
   * @method delete
   * @description Delete document
   * @param {String} collection Collection's name
   * @param {ObjectId} id Document's id
   * @return {Promise}
   */
  delete(collection, id) {
    const that = this;
    return new Promise((resolve, reject) => {
      if (id === null) resolve(0);

      const db = that._mongo.collection(collection);
      db.deleteOne({ _id: id }, { w: 1 }, (error, result) => {
        if (error) return reject(error);
        return resolve(result.deletedCount);
      });
    });
  }

  /**
   * @method deleteOne
   * @description Delete one document by query
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @return {Promise}
   */
  deleteOne(collection, query) {
    const that = this;
    query = castQueryIds(query);
    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);
      db.deleteOne(query, { w: 1 }, (error, result) => {
        if (error) return reject(error);
        return resolve(result.deletedCount);
      });
    });
  }

  /**
   * @method  deleteMany
   * @description Delete many documents by query
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @return {Promise}
   */
  deleteMany(collection, query) {
    const that = this;
    query = castQueryIds(query);
    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);
      db.deleteMany(query, { w: 1 }, (error, result) => {
        if (error) return reject(error);
        return resolve(result.deletedCount);
      });
    });
  }

  /**
   * @method  findOne
   * @description Find one document
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @return {Promise}
   */
  findOne(collection, query) {
    const that = this;
    query = castQueryIds(query);
    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);
      db.findOne(query, (error, doc) => {
        if (error) return reject(error);
        return resolve(doc);
      });
    });
  }

  /**
   * @method findOneAndupdate
   * @description Find one document and update it
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @param {Object} values
   * @param {Object} options
   * @return {Promise}
   */
  findOneAndUpdate(collection, query, values, options = {}) {
    const that = this;
    query = castQueryIds(query);

    // Always return the updated object
    options.returnOriginal = false;

    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);

      let update = values;
      if (options.upsert) {
        update = { $setOnInsert: update };
      } else {
        update = { $set: update };
      }

      db.findOneAndUpdate(query, update, options, (error, result) => {
        if (error) return reject(error);
        resolve(result.value);
      });
    });
  }

  /**
   * @method findOneAndDelete
   * @description Find one document and delete it
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @param {Object} options
   * @return {Promise}
   */
  findOneAndDelete(collection, query, options = {}) {
    const that = this;
    query = castQueryIds(query);

    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);

      db.findOneAndDelete(query, options, (error, result) => {
        if (error) return reject(error);
        return resolve(result.value === null ? 0 : 1);
      });
    });
  }

  /**
   * @method find
   * @description Find documents
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @param {Object} options
   * @return {Promise}
   */
  find(collection, query, options) {
    const that = this;
    query = castQueryIds(query);
    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);
      let cursor = db.find(query);
      if (
        options.sort &&
        (_.isArray(options.sort) || _.isString(options.sort))
      ) {
        const sortOptions = {};
        if (!_.isArray(options.sort)) {
          options.sort = [options.sort];
        }

        options.sort.forEach(s => {
          if (!_.isString(s)) return;

          let sortOrder = 1;
          if (s[0] === '-') {
            sortOrder = -1;
            s = s.substring(1);
          }
          sortOptions[s] = sortOrder;
        });

        cursor = cursor.sort(sortOptions);
      }
      if (typeof options.skip === 'number') {
        cursor = cursor.skip(options.skip);
      }
      if (typeof options.limit === 'number') {
        cursor = cursor.limit(options.limit);
      }
      cursor.toArray((error, docs) => {
        if (error) return reject(error);
        return resolve(docs);
      });
    });
  }

  /**
   * @method count
   * @description  Count number of matching documents in the db to a query.
   * @param {String} collection Collection's name
   * @param {Object} query Query
   * @return {Promise}
   */
  count(collection, query) {
    const that = this;
    query = castQueryIds(query);
    return new Promise((resolve, reject) => {
      const db = that._mongo.collection(collection);
      db.countDocuments(query, (error, count) => {
        if (error) return reject(error);
        return resolve(count);
      });
    });
  }

  /**
   * @method  createIndex
   * @description Create indexes for a field.
   * @param {String} collection Collection's name
   * @param {String} field Field name
   * @param {Object} options Options
   */
  createIndex(collection, field, options) {
    options.sparse = options.sparse || false;

    const db = this._mongo.collection(collection);

    const keys = {};
    keys[field] = 1;
    db.createIndex(keys, {
      unique: options.unique,
      sparse: options.sparse
    });
  }

  /**
   * @method  connect
   * @description Connect to a MongoDB cluster or database.
   * @param {String} url
   * @param {Object} options
   * @return {Promise}
   */
  static connect(url, options = {}) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        Object.assign(options, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }),
        (error, client) => {
          if (error) return reject(error);
          const db = client.db();
          return resolve(new MongoDbClient(url, db, client));
        }
      );
    });
  }

  /**
   * @method close
   * @description Closes the current connection.
   * @return {Promise}
   */
  close() {
    const that = this;
    return new Promise((resolve, reject) =>
      that._client.close(() => resolve())
    );
  }

  /**
   * @method  clearCollection
   * @description Drops a specific collection.
   * @param {String} collection
   * @return {Promise}
   */
  clearCollection(collection) {
    const that = this;
    return new Promise((resolve, reject) => {
      that._mongo.dropCollection(collection, (error, result) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  /**
   * @method dropDatabase
   * @description Drops the current database.
   * @return {Promise}
   */
  dropDatabase() {
    const that = this;
    return new Promise((resolve, reject) => {
      that._mongo.dropDatabase((error, result) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  /**
   * @method toCanonicalId
   * @description Convert ObjectId to canonical form.
   * @param {ObjectId} id
   * @return {*|string|String}
   */
  toCanonicalId(id) {
    return id.toString();
  }

  /**
   * @method isNativeId
   * @description checks if a given valie is a native id.
   * @param {Any} value
   * @return {boolean}
   */
  isNativeId(value) {
    return (
      value instanceof ObjectId ||
      String(value).match(/^[a-fA-F0-9]{24}$/) !== null
    );
  }

  /**
   * @method nativeIdType
   * @description creates an object id.
   * @return {ObjectId} MongoDB ObjectId
   */
  nativeIdType() {
    return ObjectId;
  }

  /**
   * @method driver
   * @description returns the underlying MongoDB client.
   * @return {Object} MongoDB client
   */
  driver() {
    return this._mongo;
  }
}

const castId = val => new ObjectId(val);

const castIdArray = vals => vals.map(v => castId(v));

/**
 * @method castQueryIds
 * @description Traverses query and converts all IDs to MongoID
 * @todo Should we check for $not operator?
 * @param {Object} query
 * @see {@link deepTraverse}
 * @return {Object}
 */
const castQueryIds = query => {
  deepTraverse(query, (key, val, parent) => {
    if (key === '_id') {
      if (String(parent[key]).match(/^[a-fA-F0-9]{24}$/)) {
        parent[key] = castId(parent[key]);
      } else if (isObject(parent[key]) && _.has(parent[key], '$in')) {
        parent[key].$in = castIdArray(parent[key].$in);
      } else if (isObject(parent[key]) && _.has(parent[key], '$nin')) {
        parent[key].$nin = castIdArray(parent[key].$nin);
      }
    }
  });

  return query;
};

module.exports = MongoDbClient;
