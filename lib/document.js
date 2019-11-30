'use strict';

const _ = require('lodash');
const { Client } = require('./clients');
const BaseDocument = require('./base-document');
const { isArray, isReferenceable, isEmbeddedDocument } = require('./validate');

class Document extends BaseDocument {
  constructor(name) {
    super();
  }

  // TODO: Is there a way to tell if a class is
  // a subclass of something? Until I find out
  // how, we'll be lazy use this.
  static documentClass() {
    return 'document';
  }

  documentClass() {
    return 'document';
  }

  /**
   * Save (upsert) current document
   *
   * TODO: The method is too long and complex, it is necessary to divide...
   * @returns {Promise}
   */
  save() {
    const that = this;

    let preValidatePromises = this._getHookPromises('preValidate');

    return Promise.all(preValidatePromises)
      .then(() => {
        // Validate the assigned type, choices, and min/max
        that.validate();

        // Ensure all data types are saved in the same encodings
        that.canonicalize();

        return Promise.all(that._getHookPromises('postValidate'));
      })
      .then(() => Promise.all(that._getHookPromises('preSave')))
      .then(() => {
        // TODO: We should instead track what has changed and
        // only update those values. Maybe make that._changed
        // object to do this.
        // Also, this might be really slow for objects with
        // lots of references. Figure out a better way.
        let toUpdate = that._toData({ _id: false });

        // Reference our objects
        _.keys(that._schema).forEach(key => {
          // Never care about _id
          if (key === '_id') return;

          if (
            isReferenceable(that[key]) || // isReferenceable OR
            (isArray(that[key]) && // isArray AND contains value AND value isReferenceable
              that[key].length > 0 &&
              isReferenceable(that[key][0]))
          ) {
            // Handle array of references (ex: { type: [MyObject] })
            if (isArray(that[key])) {
              toUpdate[key] = [];
              that[key].forEach(v => {
                if (Client().isNativeId(v)) {
                  toUpdate[key].push(v);
                } else {
                  toUpdate[key].push(v._id);
                }
              });
            } else {
              if (Client().isNativeId(that[key])) {
                toUpdate[key] = that[key];
              } else {
                toUpdate[key] = that[key]._id;
              }
            }
          }
        });

        // Replace EmbeddedDocument references with just their data
        _.keys(that._schema).forEach(key => {
          if (
            isEmbeddedDocument(that[key]) || // isEmbeddedDocument OR
            (isArray(that[key]) && // isArray AND contains value AND value isEmbeddedDocument
              that[key].length > 0 &&
              isEmbeddedDocument(that[key][0]))
          ) {
            // Handle array of references (ex: { type: [MyObject] })
            if (isArray(that[key])) {
              toUpdate[key] = [];
              that[key].forEach(v => {
                toUpdate[key].push(v._toData());
              });
            } else {
              toUpdate[key] = that[key]._toData();
            }
          }
        });

        return Client().save(that.collectionName(), that._id, toUpdate);
      })
      .then(id => {
        if (that._id === null) {
          that._id = id;
        }
      })
      .then(() => {
        // TODO: hack?
        let postSavePromises = that._getHookPromises('postSave');
        return Promise.all(postSavePromises);
      })
      .then(() => {
        return that;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  /**
   * Delete current document
   *
   * @returns {Promise}
   */
  delete() {
    const that = this;

    let preDeletePromises = that._getHookPromises('preDelete');

    return Promise.all(preDeletePromises)
      .then(() => {
        return Client().delete(that.collectionName(), that._id);
      })
      .then(deleteReturn => {
        // TODO: hack?
        let postDeletePromises = [deleteReturn].concat(
          that._getHookPromises('postDelete')
        );
        return Promise.all(postDeletePromises);
      })
      .then(prevData => {
        let deleteReturn = prevData[0];
        return deleteReturn;
      });
  }

  /**
   * Delete one document in current collection
   *
   * @param {Object} query Query
   * @returns {Promise}
   */
  static deleteOne(query) {
    return Client().deleteOne(this.collectionName(), query);
  }

  /**
   * Delete many documents in current collection
   *
   * @param {Object} query Query
   * @returns {Promise}
   */
  static deleteMany(query) {
    if (query === undefined || query === null) {
      query = {};
    }

    return Client().deleteMany(this.collectionName(), query);
  }

  /**
   * Find one document in current collection
   *
   * TODO: Need options to specify whether references should be loaded
   *
   * @param {Object} query Query
   * @returns {Promise}
   */
  static findOne(query, options) {
    const that = this;

    let populate = true;
    if (options && options.hasOwnProperty('populate')) {
      populate = options.populate;
    }

    return Client()
      .findOne(this.collectionName(), query)
      .then(data => {
        if (!data) {
          return null;
        }

        let doc = that._fromData(data);
        if (populate === true || (isArray(populate) && populate.length > 0)) {
          return that.populate(doc, populate).then(doc => that._postFind(doc));
        }

        return that._postFind(doc);
      })
      .then(
        data =>
          options !== undefined && options.select
            ? _.pick(data, ['_id', ...options.select])
            : data
      )
      .then(docs => {
        if (docs) {
          return docs;
        }
        return null;
      });
  }

  /**
   * Find one document and update it in current collection
   *
   * @param {Object} query Query
   * @param {Object} values
   * @param {Object} options
   * @returns {Promise}
   */
  static findOneAndUpdate(query, values, options) {
    const that = this;

    if (arguments.length < 2) {
      throw new Error(
        'findOneAndUpdate requires at least 2 arguments. Got ' +
          arguments.length +
          '.'
      );
    }

    if (!options) {
      options = {};
    }

    let populate = true;
    if (options.hasOwnProperty('populate')) {
      populate = options.populate;
    }

    return Client()
      .findOneAndUpdate(this.collectionName(), query, values, options)
      .then(data => {
        if (!data) {
          return null;
        }

        let doc = that._fromData(data);
        if (populate) {
          return that.populate(doc);
        }

        return doc;
      })
      .then(
        data =>
          options !== undefined && options.select
            ? _.pick(data, ['_id', ...options.select])
            : data
      );
  }

  /**
   * Find one document and delete it in current collection
   *
   * @param {Object} query Query
   * @param {Object} options
   * @returns {Promise}
   */
  static findOneAndDelete(query, options = {}) {
    if (arguments.length < 1) {
      throw new Error(
        'findOneAndDelete requires at least 1 argument. Got ' +
          arguments.length +
          '.'
      );
    }

    return Client().findOneAndDelete(this.collectionName(), query, options);
  }

  static _postFind(docs) {
    let postFindPromises = [];

    postFindPromises.concat(docs._getHookPromises('postFind'));

    return Promise.all(postFindPromises).then(() => {
      return docs;
    });
  }
  /**
   * Find documents
   *
   * TODO: Need options to specify whether references should be loaded
   *
   * @param {Object} query Query
   * @param {Object} options
   * @returns {Promise}
   */
  static find(query, options) {
    const that = this;

    if (query === undefined || query === null) {
      query = {};
    }

    if (options === undefined || options === null) {
      // Populate by default
      options = { populate: true };
    }

    return (
      Client()
        .find(this.collectionName(), query, options)
        .then(datas => {
          let docs = that._fromData(datas);

          if (
            options.populate === true ||
            (isArray(options.populate) && options.populate.length > 0)
          ) {
            return that.populate(docs, options.populate);
          }

          return docs;
        })
        // ensure we always return an array
        .then(docs => [].concat(docs))
        .then(
          data =>
            options && options.select
              ? _.map(data, datum => _.pick(datum, ['_id', ...options.select]))
              : data
        )
    );
  }

  /**
   * Get count documents in current collection by query
   *
   * @param {Object} query Query
   * @returns {Promise}
   */
  static count(query) {
    return Client().count(this.collectionName(), query);
  }

  /**
   * Create indexes
   *
   * @returns {Promise}
   */
  static createIndexes() {
    if (this._indexesCreated) {
      return;
    }

    const that = this;
    let instance = this._instantiate();

    _.keys(instance._schema).forEach(k => {
      if (instance._schema[k].unique) {
        Client().createIndex(that.collectionName(), k, { unique: true });
      }
    });

    this._indexesCreated = true;
  }

  static _fromData(datas) {
    let instances = super._fromData(datas);

    return instances;
  }

  /**
   * Clear current collection
   *
   * @returns {Promise}
   */
  static clearCollection() {
    return Client().clearCollection(this.collectionName());
  }
}

module.exports = { Document };
