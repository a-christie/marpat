'use strict';

const ClientRegistry = require('./clients/registry');
const { ConnectionError } = require('./errors');

/**
 * @function connect
 * @description The connect function  to current database.
 * @param {String} url the url to use to establish a connection to the datastore.
 * @param {Object} [options] Options used to modify the connection to the datastore.
 * @return {Promise} a promise which resolves with a connected datastore or rejects with an error.
 * @see  {@link ClientRegistry}
 */
const connect = (url, options) => {
  const Client = ClientRegistry.getClient(url);

  if (!Client) {
    return Promise.reject(
      new ConnectionError('Unrecognized DB connection url.')
    );
  }

  return Client.connect(url, options).then(db => {
    global.CLIENT = db;
    return db;
  });
};

module.exports = { connect };
