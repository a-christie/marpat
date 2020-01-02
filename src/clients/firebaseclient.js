'use strict';

const _ = require('lodash');
const admin = require('firebase-admin');
const flatten = require('flat');
const DatabaseClient = require('./client');
const { deepTraverse } = require('../util');

const addWhereToRef = (ref, where) => {
  if (!Array.isArray(where)) {
    throw new Error('where parameter must be an array.');
  }

  if (Array.isArray(where[0])) {
    return where.reduce((acc, whereArgs) => addWhereToRef(acc, whereArgs), ref);
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
          ids.push(value);
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

/**
 * @class MongoDbClient
 * @classdesc The class used to integrate with Mongodb
 */
class FirestoreClient extends DatabaseClient {
  /** @constructs
   * @param {String} url The mongodb connection url.
   * @param {Object} firestore The firestore instance.
   * @param {Object} admin The connection client.
   */
  constructor(url, firestore, admin) {
    super(url);
    this._admin = admin;
    this._firestore = firestore;
  }

  /**
   * @method canHandle
   * @description tests a given url to see if the client can handle connection.
   * @param {String} url The url to test.
   * @return {Promise} Promise with result insert or update query
   */
  static canHandle(url) {
    return _.isObject(url);
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
      const db = that._firestore.collection(collection);

      const data = _.pickBy(values, _.identity);
      if (id === null) {
        db.add(data)
          .then(documentReference => {
            resolve(documentReference.id);
          })
          .catch(error => reject(error));
      } else {
        db.doc(id)
          .set(data)
          .then(documentReference => resolve(documentReference.id))
          .catch(error => reject(error));
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

      const doc = that._firestore.collection(collection).doc(id);
      doc
        .delete()
        .then(result => resolve(result))
        .catch(error => reject(error));
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
      const db = that._firestore.collection(collection);
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
      const db = that._firestore.collection(collection);
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
  findOne(collection, where) {
    const that = this;

    return new Promise((resolve, reject) => {
      const reference = that._firestore.collection(collection);
      const query = addWhereToRef(reference, where);

      return query
        .limit(1)
        .get()
        .then(snapshot => {
          if (snapshot.empty) resolve(null);
          resolve({ _id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        })
        .catch(error => reject(error));
    });
  }

  /**
   * @method findOneAndupdate
   * @description Find one document and update it
   * @param {String} collection Collection's name
   * @param {Object} where Query
   * @param {Object} values
   * @param {Object} options
   * @return {Promise}
   */
  findOneAndUpdate(collection, where, values, options = {}) {
    const that = this;

    return new Promise((resolve, reject) => {
      const reference = that._firestore.collection(collection);
      const query = addWhereToRef(reference, where);
      const data = _.pickBy(values, _.identity);
      return query
        .limit(1)
        .get()
        .then(snapshot => {
          if (snapshot.empty && options.upsert) {
            reference
              .add(data)
              .then(documentReference =>
                resolve({
                  _id: documentReference.id,
                  ...documentReference.get()
                })
              )
              .catch(error => reject(error));
          } else if (!snapshot.empty) {
            reference
              .doc(snapshot.docs[0].id)
              .update(data)
              .then(documentReference =>
                resolve({
                  _id: snapshot.docs[0].id,
                  ...snapshot.docs[0].data(),
                  ...data
                })
              )
              .catch(error => reject(error));
          } else {
            reject(new Error('No document found to update.'));
          }
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
    query = convertQuery(query);

    return new Promise((resolve, reject) => {
      const db = that._firestore.collection(collection);

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
    console.log(options);
    const that = this;
    const { queries, ids } = convertQuery(query);
    return new Promise((resolve, reject) => {
      const reference = that._firestore.collection(collection);
      Promise.all([
        ...queries.map(where => {
          let query = addWhereToRef(reference, where);
          return query
            .get()
            .then(snapshot =>
              snapshot.empty
                ? []
                : snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }))
            );
        }),
        ...ids.map(_id =>
          reference
            .doc(_id)
            .get()
            .then(snapshot => ({ _id, ...snapshot.data() }))
        )
      ])
        .then(docs => _.flatten(docs))
        .then(docs => resolve(docs))
        .catch(error => reject(error));
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
      const db = that._firestore.collection(collection);
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

    const db = this.db.collection(collection);

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
   * @param {Object} options
   * @return {Promise}
   */
  static async connect(options = {}) {
    return new Promise((resolve, reject) => {
      admin.initializeApp(options);
      const firestore = admin.firestore();
      return resolve(new FirestoreClient(options, firestore, admin));
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
      that._admin.delete(() => resolve())
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
    const db = that._firestore.collection(collection);
    return new Promise((resolve, reject) => {
      db.get().then(snapshot => {
        if (snapshot.empty) {
          resolve();
        } else {
          Promise.all(snapshot.docs.forEach(doc => doc.delete())).then(result=>resolve());
        }
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
      that._firestore.dropDatabase((error, result) => {
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
    return String(value).match(/^[a-zA-Z0-9]{16}$/) !== null;
  }

  /**
   * @method nativeIdType
   * @description creates an object id.
   * @return {ObjectId} MongoDB ObjectId
   */
  nativeIdType() {
    return String;
  }

  /**
   * @method driver
   * @description returns the underlying admin client.
   * @return {Object} Admin client
   */
  driver() {
    return this._admin;
  }
}

module.exports = FirestoreClient;
