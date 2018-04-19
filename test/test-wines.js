'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { Wine } = require('../wines');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

const TESTUSER = {
  username: 'example@test.com',
  password: '1234567890'
};

let TOKEN = null; // to be filled in by createTestUser

function getValidToken() {
  return chai
    .request(app)
    .post('/auth/login')
    .send(TESTUSER)
    .then(res => {
      TOKEN = res.body.authToken;
    });
}

function createTestUser() {
  return User.hashPassword(TESTUSER.password)
    .then(hash => {
      const newUser = Object.assign({}, TESTUSER);
      newUser.password = hash;
      return User.create(newUser);
    })
    .then(created => {
      TESTUSER.userId = created._id;
    })
    .then(function() {
      return getValidToken();
    });
}

function removeTestUser() {
  return new Promise((resolve, reject) => {
    User.remove({})
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}


function seedWinesData() {
  const seedData = [];
  for (let i = 1; i <= 30; i++) {
    seedData.push({
      points: `${faker.random.number()}`,
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(),
      price: `${faker.commerce.price()}`,
      designation: faker.lorem.words(),
      variety: faker.lorem.word(),
      region_1: faker.address.city(),
      region_2: faker.address.county(),
      province: faker.address.state(),
      country: faker.address.country(),
      winery: faker.company.companyName()
    });
  }
  // this will return a promise
  return Wine.insertMany(seedData);
}

function clearWines() {
  return new Promise((resolve, reject) => {
    Wine.deleteMany({})
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}


describe('/wines', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL).then(() => createTestUser());
  });

  after(function () {
    return removeTestUser().then(() => closeServer());
  });

  beforeEach(function () {
    return seedWinesData();
  });

  afterEach(function () {
    return clearWines();
  });


  it('Should reject requests without a valid token', function() {
    return chai
    	.request(app)
      .get('/wines')
      .then(() =>
        expect.fail(null, null, 'Request should not succeed')
      )
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(401);
      });
  });


	it('Should send wines data', function () {
		const expectedKeys = ['wineId', 'name', 'description', 'cost', 'rating', 'type', 'region', 'state', 'winery'];

  	return chai
      .request(app)
      .get('/wines')
      .set('authorization', `Bearer ${TOKEN}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(20);
        res.body.forEach(function(item) {
		      expect(item).to.be.a('object');
		      expect(item).to.include.keys(expectedKeys);
    		});
      });
  });
});