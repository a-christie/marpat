'use strict';

/* global describe it */

const { expect } = require('chai');

const DatabaseClient = require('../../src/clients/client');

describe('Base Client', function() {
  describe('Required Methods', function() {
    it('should require a (static) canHandle method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      expect(() => ErrorClient.canHandle()).to.throw();
    });
    it('should require a save method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.save()).to.throw();
    });
    it('should require a delete method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.delete()).to.throw();
    });
    it('should require a delete method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.deleteOne()).to.throw();
    });
    it('should require a deleteMany method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.deleteMany()).to.throw();
    });

    it('should require a findOne method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.findOne()).to.throw();
    });
    it('should require a findOneAndUpdate method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.findOneAndUpdate()).to.throw();
    });
    it('should require a findOneAndDelete method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.findOneAndDelete()).to.throw();
    });
    it('should require a find method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.find()).to.throw();
    });
    it('should require a find method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.find()).to.throw();
    });
    it('should require a count method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.count()).to.throw();
    });
    it('should require a createIndex method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.createIndex()).to.throw();
    });
    it('should require a (static) connect method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      expect(() => ErrorClient.connect()).to.throw();
    });
    it('should require a close method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.close()).to.throw();
    });
    it('should require a clearCollection method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.clearCollection()).to.throw();
    });
    it('should require a dropDatabase method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.dropDatabase()).to.throw();
    });
    it('should require a toCanonicalId method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.toCanonicalId()).to.throw();
    });
    it('should require a isNativeId method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.isNativeId()).to.throw();
    });
    it('should require a toNativeId method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.toNativeId()).to.throw();
    });
    it('should require a nativeIdType method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.nativeIdType()).to.throw();
    });
    it('should require a driver method', function() {
      class ErrorClient extends DatabaseClient {
        constructor() {
          super();
          this.name = String;
        }
      }
      let client = new ErrorClient();
      expect(() => client.driver()).to.throw();
    });
  });
});
