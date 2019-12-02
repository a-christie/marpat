'use strict';

const NeDbClient = require('./nedbclient');
const MongoClient = require('./mongoclient');
const FirestoreClient = require('./firebaseclient')

class ClientRegistry {
  constructor() {
    this.clients = [NeDbClient, MongoClient, FirestoreClient];
  }

  add(client) {
    this.clients.push(client);
  }

  getClient(url) {
    const client = this.clients.find(client => {
      return client.canHandle(url);
    });
    return client;
  }
}

module.exports = new ClientRegistry();
