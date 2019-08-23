'use strict';

const ClientRegistry = require('./clients/registry');

/**
 * Connect to current database
 *
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
exports.connect = function(url, options) {
  const Client = ClientRegistry.getClient(url);

  if (!Client) {
    return Promise.reject(new Error('Unrecognized DB connection url.'));
  }

  if (global.CLIENT) {
    const db = global.CLIENT;
    return Promise.resolve().then(() => db);
  }

  return Client.connect(url, options).then(function(db) {
    global.CLIENT = db;
    return db;
  });
};
