'use strict';

/* global describe before beforeEach afterEach, after, it */

const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { connect, Document, Client } = require('../../index');
const { Data } = require('../mocks');
const getData1 = require('../util').data1;
const getData2 = require('../util').data2;
const { Address, Pet, User } = require('../mocks');
const { validateData1, validateId } = require('../util');
const { isNativeId } = require('../../lib/validate');

const sandbox = sinon.createSandbox();

describe('Base MongoDB Client', () => {
  const url = 'mongodb://localhost/marpat_test';
  let database = null;

  before(done => {
    connect(url)
      .then(db => {
        database = db;
        database.dropDatabase();
      })
      .then(() => done());
  });

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    sandbox.restore();
    setTimeout(() => {
      return done();
    }, 200);
  });

  after(() => database.dropDatabase());

  describe('#save()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });

    it('should reject if it can not update the object', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().save('Datas', undefined, data);
        })
        .then(function() {
          expect.fail(null, Error, 'Expected error, but got none.');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#deleteMany()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });

    it('should reject if it can not delete the object', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().deleteMany('Datas', '-2');
        })
        .then(function(result) {
          expect.fail(null, Error, 'Expected error, but got none.');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#delete()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });

    it('should reject if it can not delete the object', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().delete('Datas', { $nin: -2 });
        })
        .then(function(result) {
          expect.fail(null, Error, 'Expected error, but got none.');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#deleteOne()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });

    it('should reject if it can not delete the object', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().deleteOne('Datas', { $nin: -2 });
        })
        .then(function(result) {
          expect.fail(null, Error, 'Expected error, but got none.');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#findOne()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });
    it('should reject if it can not delete the object', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().findOne('Datas', '-2');
        })
        .then(function(result) {
          expect.fail(null, Error, 'Expected error, but got none.');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#dropDatabase()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });
    it('should reject if mongo rejects', function(done) {
      sandbox.stub(Client()._mongo, 'dropDatabase').callsFake(callback => {
        let error = Error('sinon mock error');
        return callback(error, null);
      });
      Client()
        .dropDatabase()
        .catch(error => {
          expect(error instanceof Error).to.be.true;
          done();
        });
    });
  });
  describe('#count()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });
    it('should reject an invalid count query', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().count('Datas', { $nin: -2 });
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#findOneAndDelete()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });
    it('should reject an invalid findOneAndDelete query', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().findOneAndDelete('Datas', { $nin: -2 });
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
    it('should return zero if no results are found', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().findOneAndDelete('Datas', { _id: 0 });
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#findOneAndupdate()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });
    it('should reject an invalid findOneAndUpdate query', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().findOneAndUpdate('Datas', { $nin: -2 });
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
    it('should return zero if no results are found', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().findOneAndDelete('Datas', { _id: 0 });
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
  describe('#clearCollection()', () => {
    afterEach(done => {
      sandbox.restore();
      setTimeout(() => {
        return done();
      }, 200);
    });
    it('should reject an invalid findOneAndDelete query', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
          data._id = {};
          return Client().clearCollection('none');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });
  });
});

describe('MongoDB Client', () => {
  const url = 'mongodb://localhost/marpat_test';
  let database = null;

  before(done => {
    connect(url)
      .then(db => {
        database = db;
        database.dropDatabase();
      })
      .then(() => done());
  });

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    sandbox.restore();
    database.dropDatabase();
    setTimeout(() => {
      return done();
    }, 200);
  });

  after(() => database.dropDatabase());
  describe('#save()', () => {
    it('should persist the object and its members to the database', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          validateData1(data);
        })
        .then(done, done);
    });
  });

  describe('#findOne()', () => {
    it('should load a single object from the collection', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return Data.findOne({ item: 99 });
        })
        .then(d => {
          validateId(d);
          validateData1(d);
        })
        .then(done, done);
    });

    it('should populate all fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return user.save();
        })
        .then(() => {
          validateId(user);
          return User.findOne({ _id: user._id }, { populate: true });
        })
        .then(u => {
          expect(u.pet).to.be.an.instanceof(Pet);
          expect(u.address).to.be.an.instanceof(Address);
        })
        .then(done, done);
    });

    it('should not populate any fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return user.save();
        })
        .then(() => {
          validateId(user);
          return User.findOne({ _id: user._id }, { populate: false });
        })
        .then(u => {
          expect(isNativeId(u.pet)).to.be.true;
          expect(isNativeId(u.address)).to.be.true;
        })
        .then(done, done);
    });

    it('should populate specified fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return user.save();
        })
        .then(() => {
          validateId(user);
          return User.findOne({ _id: user._id }, { populate: ['pet'] });
        })
        .then(u => {
          expect(u.pet).to.be.an.instanceof(Pet);
          expect(isNativeId(u.address)).to.be.true;
        })
        .then(done, done);
    });
    it('should select only the specified fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return user.save();
        })
        .then(() => {
          validateId(user);
          return User.findOne(
            { _id: user._id },
            { select: ['firstName', 'pet', 'address'], populate: ['pet'] }
          );
        })
        .then(u => {
          expect(u).to.have.any.keys('firstName');
          expect(u).to.not.have.keys('lastName');
          expect(u.pet).to.be.an.instanceof(Pet);
          expect(isNativeId(u.address)).to.be.true;
        })
        .then(done, done);
    });
  });

  describe('#findOneAndUpdate()', () => {
    it('should return null if there is no document to update', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return Data.findOneAndUpdate({ number: 3 }, { source: 'wired' });
        })
        .then(d => {
          expect(d).to.equal(null);
        })
        .then(done, done);
    });
    it('should load and update a single object from the collection', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return Data.findOneAndUpdate({ number: 1 }, { source: 'wired' });
        })
        .then(d => {
          validateId(d);
          expect(d.number).to.equal(1);
          expect(d.source).to.equal('wired');
        })
        .then(done, done);
    });

    it('should populate all fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user = User.create({
        firstName: 'Anakin',
        lastName: 'Skywalker',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return Promise.all([user.save()]);
        })
        .then(() => {
          validateId(user);
          return User.findOneAndUpdate(
            { firstName: 'Anakin' },
            { firstName: 'Darth' },
            { populate: true }
          );
        })
        .then(user => {
          expect(user.pet).to.be.an.instanceof(Pet);
          expect(user.address).to.be.an.instanceof(Address);
        })
        .then(done, done);
    });

    it('should not populate any fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user = User.create({
        firstName: 'Anakin',
        lastName: 'Skywalker',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return Promise.all([user.save()]);
        })
        .then(() => {
          validateId(user);
          return User.findOneAndUpdate(
            { firstName: 'Anakin' },
            { firstName: 'Darth' },
            { populate: false }
          );
        })
        .then(user => {
          expect(isNativeId(user.pet)).to.be.true;
          expect(isNativeId(user.address)).to.be.true;
        })
        .then(done, done);
    });

    it('should return only the selected information', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return Data.findOneAndUpdate(
            { number: 1 },
            { source: 'wired' },
            { select: ['number', 'source'] }
          );
        })
        .then(d => {
          validateId(d);
          expect(d.number).to.equal(1);
          expect(d).to.not.have.keys('item');
          expect(d.source).to.equal('wired');
        })
        .then(done, done);
    });

    it('should insert a single object to the collection', done => {
      Data.findOne({ number: 1 })
        .then(d => {
          expect(d).to.be.null;
          return Data.findOneAndUpdate(
            { number: 1 },
            { number: 1 },
            { upsert: true }
          );
        })
        .then(data => {
          validateId(data);
          expect(data.number).to.equal(1);
          return Data.findOne({ number: 1 });
        })
        .then(d => {
          validateId(d);
          expect(d.number).to.equal(1);
        })
        .then(done, done);
    });
    it('requires at least two arguments', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          expect(() => Data.findOneAndUpdate({ number: 3 })).to.throw();
        })
        .then(done, done);
    });
  });

  describe('#findOneAndDelete()', () => {
    it('requires at least one argument', function(done) {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          expect(() => Data.findOneAndDelete()).to.throw();
        })
        .then(done, done);
    });
    it('should load and delete a single object from the collection', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return Data.count({ number: 1 });
        })
        .then(count => {
          expect(count).to.be.equal(1);
          return Data.findOneAndDelete({ number: 1 });
        })
        .then(numDeleted => {
          expect(numDeleted).to.equal(1);
          return Data.count({ number: 1 });
        })
        .then(count => {
          expect(count).to.equal(0);
        })
        .then(done, done);
    });
  });

  describe('#find()', () => {
    class City extends Document {
      constructor() {
        super();

        this.name = String;
        this.population = Number;
      }

      static collectionName() {
        return 'cities';
      }
    }

    var Springfield, SouthPark, Quahog;

    beforeEach(done => {
      Springfield = City.create({
        name: 'Springfield',
        population: 30720
      });

      SouthPark = City.create({
        name: 'South Park',
        population: 4388
      });

      Quahog = City.create({
        name: 'Quahog',
        population: 800
      });

      afterEach(done => {
        sandbox.restore();
        return done();
      });

      Promise.all([Springfield.save(), SouthPark.save(), Quahog.save()]).then(
        () => {
          validateId(Springfield);
          validateId(SouthPark);
          validateId(Quahog);
          done();
        }
      );
    });

    it('should load multiple objects from the collection', done => {
      City.find({})
        .then(cities => {
          expect(cities).to.have.length(3);
          validateId(cities[0]);
          validateId(cities[1]);
          validateId(cities[2]);
        })
        .then(done, done);
    });

    it('should reject if mongo cursor rejects', done => {
      let mockDbCollection = {
        find: function() {
          return {
            toArray: function(callback) {
              let error = Error('sinon stubbed error');
              return callback(error);
            }
          };
        }
      };

      sandbox.stub(Client()._mongo, 'collection').returns(mockDbCollection);

      City.find({}).catch(error => {
        expect(error instanceof Error).to.be.true;
        done();
      });
    });

    it('should load all objects when query is not provided', done => {
      City.find()
        .then(cities => {
          expect(cities).to.have.length(3);
          validateId(cities[0]);
          validateId(cities[1]);
          validateId(cities[2]);
        })
        .then(done, done);
    });

    it('should sort results in ascending order', done => {
      City.find({}, { sort: 'population' })
        .then(cities => {
          expect(cities).to.have.length(3);
          validateId(cities[0]);
          validateId(cities[1]);
          validateId(cities[2]);
          expect(cities[0].population).to.be.equal(800);
          expect(cities[1].population).to.be.equal(4388);
          expect(cities[2].population).to.be.equal(30720);
        })
        .then(done, done);
    });

    it('should sort results in descending order', done => {
      City.find({}, { sort: '-population' })
        .then(cities => {
          expect(cities).to.have.length(3);
          validateId(cities[0]);
          validateId(cities[1]);
          validateId(cities[2]);
          expect(cities[0].population).to.be.equal(30720);
          expect(cities[1].population).to.be.equal(4388);
          expect(cities[2].population).to.be.equal(800);
        })
        .then(done, done);
    });

    it('should sort results using multiple keys', done => {
      let AlphaVille = City.create({
        name: 'Alphaville',
        population: 4388
      });

      let BetaTown = City.create({
        name: 'Beta Town',
        population: 4388
      });

      Promise.all([AlphaVille.save(), BetaTown.save()])
        .then(() => {
          return City.find({}, { sort: ['population', 1, '-name'] });
        })
        .then(cities => {
          expect(cities).to.have.length(5);
          validateId(cities[0]);
          validateId(cities[1]);
          validateId(cities[2]);
          validateId(cities[3]);
          validateId(cities[4]);
          expect(cities[0].population).to.be.equal(800);
          expect(cities[0].name).to.be.equal('Quahog');
          expect(cities[1].population).to.be.equal(4388);
          expect(cities[1].name).to.be.equal('South Park');
          expect(cities[2].population).to.be.equal(4388);
          expect(cities[2].name).to.be.equal('Beta Town');
          expect(cities[3].population).to.be.equal(4388);
          expect(cities[3].name).to.be.equal('Alphaville');
          expect(cities[4].population).to.be.equal(30720);
          expect(cities[4].name).to.be.equal('Springfield');
        })
        .then(done, done);
    });

    it('should sort results using multiple keys', done => {
      let AlphaVille = City.create({
        name: 'Alphaville',
        population: 4388
      });

      let BetaTown = City.create({
        name: 'Beta Town',
        population: 4388
      });

      Promise.all([AlphaVille.save(), BetaTown.save()])
        .then(() => {
          return City.find({}, { sort: ['population', '-name'] });
        })
        .then(cities => {
          expect(cities).to.have.length(5);
          validateId(cities[0]);
          validateId(cities[1]);
          validateId(cities[2]);
          validateId(cities[3]);
          validateId(cities[4]);
          expect(cities[0].population).to.be.equal(800);
          expect(cities[0].name).to.be.equal('Quahog');
          expect(cities[1].population).to.be.equal(4388);
          expect(cities[1].name).to.be.equal('South Park');
          expect(cities[2].population).to.be.equal(4388);
          expect(cities[2].name).to.be.equal('Beta Town');
          expect(cities[3].population).to.be.equal(4388);
          expect(cities[3].name).to.be.equal('Alphaville');
          expect(cities[4].population).to.be.equal(30720);
          expect(cities[4].name).to.be.equal('Springfield');
        })
        .then(done, done);
    });

    it('should limit number of results returned', done => {
      City.find({}, { limit: 2 })
        .then(cities => {
          expect(cities).to.have.length(2);
          validateId(cities[0]);
          validateId(cities[1]);
        })
        .then(done, done);
    });

    it('should skip given number of results', done => {
      City.find({}, { sort: 'population', skip: 1 })
        .then(cities => {
          expect(cities).to.have.length(2);
          validateId(cities[0]);
          validateId(cities[1]);
          expect(cities[0].population).to.be.equal(4388);
          expect(cities[1].population).to.be.equal(30720);
        })
        .then(done, done);
    });

    it('should populate all fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user1 = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      let user2 = User.create({
        firstName: 'Sally',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return Promise.all([user1.save(), user2.save()]);
        })
        .then(() => {
          validateId(user1);
          validateId(user2);
          return User.find({}, { populate: true });
        })
        .then(users => {
          expect(users[0].pet).to.be.an.instanceof(Pet);
          expect(users[0].address).to.be.an.instanceof(Address);
          expect(users[1].pet).to.be.an.instanceof(Pet);
          expect(users[1].address).to.be.an.instanceof(Address);
        })
        .then(done, done);
    });

    it('should not populate any fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user1 = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      let user2 = User.create({
        firstName: 'Sally',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return Promise.all([user1.save(), user2.save()]);
        })
        .then(() => {
          validateId(user1);
          validateId(user2);
          return User.find({}, { populate: false });
        })
        .then(users => {
          expect(isNativeId(users[0].pet)).to.be.true;
          expect(isNativeId(users[0].address)).to.be.true;
          expect(isNativeId(users[1].pet)).to.be.true;
          expect(isNativeId(users[1].address)).to.be.true;
        })
        .then(done, done);
    });

    it('should populate specified fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user1 = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      let user2 = User.create({
        firstName: 'Sally',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return Promise.all([user1.save(), user2.save()]);
        })
        .then(() => {
          validateId(user1);
          validateId(user2);
          return User.find({}, { populate: ['pet'] });
        })
        .then(users => {
          expect(users[0].pet).to.be.an.instanceof(Pet);
          expect(isNativeId(users[0].address)).to.be.true;
          expect(users[1].pet).to.be.an.instanceof(Pet);
          expect(isNativeId(users[1].address)).to.be.true;
        })
        .then(done, done);
    });
    it('should select specified fields', done => {
      let address = Address.create({
        street: '123 Fake St.',
        city: 'Cityville',
        zipCode: 12345
      });

      let dog = Pet.create({
        type: 'dog',
        name: 'Fido'
      });

      let user1 = User.create({
        firstName: 'Billy',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      let user2 = User.create({
        firstName: 'Sally',
        lastName: 'Bob',
        pet: dog,
        address: address
      });

      Promise.all([address.save(), dog.save()])
        .then(() => {
          validateId(address);
          validateId(dog);
          return Promise.all([user1.save(), user2.save()]);
        })
        .then(() => {
          validateId(user1);
          validateId(user2);
          return User.find(
            {},
            { select: ['firstName', 'pet', 'address'], populate: ['pet'] }
          );
        })
        .then(users => {
          expect(users[0].firstName).to.be.a('string');
          expect(users[1]).to.not.have.keys('lastName');
          expect(users[0].pet).to.be.an.instanceof(Pet);
          expect(isNativeId(users[0].address)).to.be.true;
          expect(users[1].pet).to.be.an.instanceof(Pet);
          expect(isNativeId(users[1].address)).to.be.true;
        })
        .then(done, done);
    });
  });

  describe('#count()', () => {
    it('should return 0 objects from the collection', done => {
      let data1 = getData1();
      let data2 = getData2();

      Promise.all([data1.save(), data2.save()])
        .then(() => {
          validateId(data1);
          validateId(data2);
          return Data.count({ number: 3 });
        })
        .then(count => {
          expect(count).to.be.equal(0);
        })
        .then(done, done);
    });

    it('should disregard unsupported options', done => {
      let data1 = getData1();
      let data2 = getData2();

      Promise.all([data1.save(), data2.save()])
        .then(() => {
          validateId(data1);
          validateId(data2);
          return Data.count({});
        })
        .then(count => {
          expect(count).to.be.equal(2);
        })
        .then(done, done);
    });

    it('should return 2 matching objects from the collection', done => {
      let data1 = getData1();
      let data2 = getData2();

      Promise.all([data1.save(), data2.save()])
        .then(() => {
          validateId(data1);
          validateId(data2);
          return Data.count({});
        })
        .then(count => {
          expect(count).to.be.equal(2);
        })
        .then(done, done);
    });
  });

  describe('#delete()', () => {
    it('should remove instance from the collection', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return data.delete();
        })
        .then(numDeleted => {
          expect(numDeleted).to.be.equal(1);
          return Data.findOne({ item: 99 });
        })
        .then(d => {
          expect(d).to.be.null;
        })
        .then(done, done);
    });
    it('should return zero if there are no items to remove', done => {
      let data = getData1();

      data
        .delete()
        .then(numDeleted => {
          expect(numDeleted).to.be.equal(0);
          return Data.findOne({ item: 99 });
        })
        .then(d => {
          expect(d).to.be.null;
        })
        .then(done, done);
    });
  });

  describe('#deleteOne()', () => {
    it('should remove the object from the collection', done => {
      let data = getData1();

      data
        .save()
        .then(() => {
          validateId(data);
          return Data.deleteOne({ number: 1 });
        })
        .then(numDeleted => {
          expect(numDeleted).to.be.equal(1);
          return Data.findOne({ number: 1 });
        })
        .then(d => {
          expect(d).to.be.null;
        })
        .then(done, done);
    });
    it('should return zero if there are no items to remove', done => {
      let data = getData1();
      data;
      Data.deleteOne({ bad: 1 })
        .then(numDeleted => {
          expect(numDeleted).to.be.equal(0);
          return Data.findOne({ item: 99 });
        })
        .then(d => {
          expect(d).to.be.null;
        })
        .then(done, done);
    });
  });

  describe('#deleteMany()', () => {
    it('should remove multiple objects from the collection', done => {
      let data1 = getData1();
      let data2 = getData2();

      Promise.all([data1.save(), data2.save()])
        .then(() => {
          validateId(data1);
          validateId(data2);
          return Data.deleteMany({});
        })
        .then(numDeleted => {
          expect(numDeleted).to.be.equal(2);
          return Data.find({});
        })
        .then(datas => {
          expect(datas).to.have.length(0);
        })
        .then(done, done);
    });

    it('should remove all objects when query is not provided', done => {
      let data1 = getData1();
      let data2 = getData2();

      Promise.all([data1.save(), data2.save()])
        .then(() => {
          validateId(data1);
          validateId(data2);
          return Data.deleteMany();
        })
        .then(numDeleted => {
          expect(numDeleted).to.be.equal(2);
          return Data.find({});
        })
        .then(datas => {
          expect(datas).to.have.length(0);
        })
        .then(done, done);
    });
  });

  describe('#clearCollection()', () => {
    it('should remove all objects from the collection', done => {
      let data1 = getData1();
      let data2 = getData2();

      Promise.all([data1.save(), data2.save()])
        .then(() => {
          validateId(data1);
          validateId(data2);
          return Data.clearCollection();
        })
        .then(() => {
          return Data.find();
        })
        .then(datas => {
          expect(datas).to.have.length(0);
        })
        .then(done, done);
    });
  });

  describe('id', function() {
    it('should allow custom _id values', function(done) {
      class School extends Document {
        constructor() {
          super();

          this.name = String;
        }
      }

      let school = School.create();
      school._id = new ObjectId('1234567890abcdef12345678');
      school.name = 'Springfield Elementary';

      school
        .save()
        .then(function() {
          validateId(school);
          expect(school._id.toString()).to.be.equal('1234567890abcdef12345678');
          return School.findOne();
        })
        .then(function(s) {
          validateId(s);
          expect(s._id.toString()).to.be.equal('1234567890abcdef12345678');
        })
        .then(done, done);
    });
  });

  describe('query', function() {
    class User extends Document {
      constructor() {
        super();
        this.firstName = String;
        this.lastName = String;
      }
    }

    /*
     * The MongoClient should cast all IDs to ObjectIDs. If the objects
     * requested aren't properly returned, then the IDs were not
     * successfully cast.
     */
    it('should automatically cast string ID in query to ObjectID', function(done) {
      let user = User.create();
      user.firstName = 'Billy';
      user.lastName = 'Bob';

      user
        .save()
        .then(function() {
          validateId(user);

          let id = String(user._id);
          return User.findOne({ _id: id });
        })
        .then(function(u) {
          validateId(u);
        })
        .then(done, done);
    });

    /*
     * Sanity check to make sure we didn't screw up the case
     * where user actually passes an ObjectId
     */
    it('should automatically cast string ID in query to ObjectID', function(done) {
      let user = User.create();
      user.firstName = 'Billy';
      user.lastName = 'Bob';

      user
        .save()
        .then(function() {
          validateId(user);

          return User.findOne({ _id: user._id });
        })
        .then(function(u) {
          validateId(u);
        })
        .then(done, done);
    });

    /*
     * Same as above, but we're testing out more complicated
     * queries. In this case we try it with '$in'.
     */
    it("should automatically cast string IDs in '$in' operator to ObjectIDs", function(done) {
      let user1 = User.create();
      user1.firstName = 'Billy';
      user1.lastName = 'Bob';

      let user2 = User.create();
      user2.firstName = 'Jenny';
      user2.lastName = 'Jane';

      let user3 = User.create();
      user3.firstName = 'Danny';
      user3.lastName = 'David';

      Promise.all([user1.save(), user2.save(), user3.save()])
        .then(function() {
          validateId(user1);
          validateId(user2);

          let id1 = String(user1._id);
          let id3 = String(user3._id);
          return User.find({ _id: { $in: [id1, id3] } });
        })
        .then(function(users) {
          expect(users).to.have.length(2);

          let u1 =
            String(users[0]._id) === String(user1._id) ? users[0] : users[1];
          let u3 =
            String(users[1]._id) === String(user3._id) ? users[1] : users[0];

          expect(String(u1._id)).to.be.equal(String(user1._id));
          expect(String(u3._id)).to.be.equal(String(user3._id));
        })
        .then(done, done);
    });

    it("should automatically cast string IDs in '$nin' operator to ObjectIDs", function(done) {
      let user1 = User.create();
      user1.firstName = 'Billy';
      user1.lastName = 'Bob';

      let user2 = User.create();
      user2.firstName = 'Jenny';
      user2.lastName = 'Jane';

      let user3 = User.create();
      user3.firstName = 'Danny';
      user3.lastName = 'David';

      Promise.all([user1.save(), user2.save(), user3.save()])
        .then(function() {
          validateId(user1);
          validateId(user2);

          let id3 = String(user3._id);
          return User.find({ _id: { $nin: [id3] } });
        })
        .then(function(users) {
          expect(users).to.have.length(2);

          let u1 =
            String(users[0]._id) === String(user1._id) ? users[0] : users[1];
          let u2 =
            String(users[1]._id) === String(user2._id) ? users[1] : users[0];

          expect(String(u1._id)).to.be.equal(String(user1._id));
          expect(String(u2._id)).to.be.equal(String(user2._id));
        })
        .then(done, done);
    });

    it("should automatically cast string IDs in '$not' operator to ObjectIDs", function(done) {
      let user1 = User.create();
      user1.firstName = 'Billy';
      user1.lastName = 'Bob';

      let user2 = User.create();
      user2.firstName = 'Jenny';
      user2.lastName = 'Jane';

      let user3 = User.create();
      user3.firstName = 'Danny';
      user3.lastName = 'David';

      Promise.all([user1.save(), user2.save(), user3.save()])
        .then(function() {
          validateId(user1);
          validateId(user2);

          let id3 = String(user3._id);
          return User.find({ _id: { $eq: id3 } });
        })
        .then(function(users) {
          expect(users).to.have.length(0);
        })
        .then(done, done);
    });

    it('should automatically cast string IDs in deep query objects', function(done) {
      let user1 = User.create();
      user1.firstName = 'Billy';
      user1.lastName = 'Bob';

      let user2 = User.create();
      user2.firstName = 'Jenny';
      user2.lastName = 'Jane';

      let user3 = User.create();
      user3.firstName = 'Danny';
      user3.lastName = 'David';

      Promise.all([user1.save(), user2.save(), user3.save()])
        .then(function() {
          validateId(user1);
          validateId(user2);

          let id1 = String(user1._id);
          let id3 = String(user3._id);
          return User.find({ $or: [{ _id: id1 }, { _id: id3 }] });
        })
        .then(function(users) {
          expect(users).to.have.length(2);

          let u1 =
            String(users[0]._id) === String(user1._id) ? users[0] : users[1];
          let u3 =
            String(users[1]._id) === String(user3._id) ? users[1] : users[0];

          expect(String(u1._id)).to.be.equal(String(user1._id));
          expect(String(u3._id)).to.be.equal(String(user3._id));
        })
        .then(done, done);
    });
  });

  describe('Close Database Connection', function() {
    connect(url).then(db => {
      database = db;
      expect(() => database.close()).to.not.throw();
    });
  });

  describe('Client Driver', function() {
    connect(url).then(db => {
      database = db;
      expect(database.driver()).to.be.an('object');
    });
  });

  describe('indexes', function() {
    it('should reject documents with duplicate values in unique-indexed fields', function(done) {
      class User extends Document {
        constructor() {
          super();

          this.schema({
            name: String,
            email: {
              type: String,
              unique: true
            }
          });
        }
      }
      let user1 = User.create();
      user1.name = 'Bill';
      user1.email = 'billy@example.com';

      let user2 = User.create();
      user1.name = 'Billy';
      user2.email = 'billy@example.com';

      Promise.all([user1.save(), user2.save()])
        .then(function() {
          expect.fail(null, Error, 'Expected error, but got none.');
        })
        .catch(function(error) {
          expect(error instanceof Error).to.be.true;
        })
        .then(done, done);
    });

    it('should accept documents with duplicate values in non-unique-indexed fields', function(done) {
      class User extends Document {
        constructor() {
          super();

          this.schema({
            name: String,
            email: {
              type: String,
              unique: false
            }
          });
        }
      }

      let user1 = User.create();
      user1.name = 'Bill';
      user1.email = 'billy@example.com';

      let user2 = User.create();
      user1.name = 'Billy';
      user2.email = 'billy@example.com';

      Promise.all([user1.save(), user2.save()])
        .then(function() {
          validateId(user1);
          validateId(user2);
          expect(user1.email).to.be.equal('billy@example.com');
          expect(user2.email).to.be.equal('billy@example.com');
        })
        .then(done, done);
    });
  });
});
