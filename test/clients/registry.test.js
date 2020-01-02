'use strict';

/* global describe it afterEach */

const { expect } = require('chai');

const DatabaseClient = require('../../lib/clients/client');
const Registry = require('../../lib/clients/registry');

describe('Client Registry', function() {
  afterEach(() => Registry.clients.splice(2));

  describe('#add', function() {
    it('should add a new client', function() {
      class Client extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }

      Registry.add(Client);

      expect(Registry.clients.indexOf(Client)).to.be.not.equal(-1);
    });

    it('should return the given client', function() {
      class Client extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }

        static canHandle(url) {
          return url.indexOf('foo://') === 0;
        }
      }

      Registry.add(Client);

      expect(Registry.getClient('foo://')).to.be.equal(Client);
    });

    it('should return the default client for nedb', function() {
      class Client extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }

        static canHandle(url) {
          return url.indexOf('foo://') === 0;
        }
      }

      Registry.add(Client);

      expect(Registry.getClient('nedb://').name).to.be.equal(
        'NeDbClient'
      );
    });

    it('should return the default client for mongodb', function() {
      class Client extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }

        static canHandle(url) {
          return url.indexOf('foo://') === 0;
        }
      }

      Registry.add(Client);

      expect(Registry.getClient('mongodb://').name).to.be.equal(
        'MongoDbClient'
      );
    });
  });
});
