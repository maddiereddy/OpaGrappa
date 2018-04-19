'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { MyList } = require('../mylist');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

const TESTUSER = {
  username: 'example@test.com',
  password: '1234567890',
  userId: null //to be filled in by createTestUser()
};

let TOKEN = null; // to be filled in by createTestUser

const newItem = {
	userId: `${TESTUSER.userId}`,
	wineId: `${faker.random.uuid()}`,
	name: faker.lorem.sentence(),
	description: faker.lorem.sentences(),
  rating: `${faker.random.number()}`,
  cost: `${faker.commerce.price()}`,
  type: faker.lorem.word(),
  region: faker.address.city(),
  state: faker.address.state(),
  winery: faker.company.companyName(),
  comments: faker.lorem.sentences()
};


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

function clearList() {
  return new Promise((resolve, reject) => {
    MyList.deleteMany({})
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

let listId = '';

describe('/mylist', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return createTestUser();
  });

  afterEach(function () {
    return removeTestUser();
  });


  it('Should reject requests without a valid token', function() {
    return chai.request(app)
      .get('/mylist')
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


	it('Should add item on POST', function () {
		return chai.request(app)
      .post('/mylist')
      .set('authorization', `Bearer ${TOKEN}`)
      .send(newItem)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(
        	'id', 'userId', 'wineId', 'comments', 
        	'name', 'description', 'cost', 'rating', 
        	'region', 'state', 'winery', 'type');
        expect(res.body.id).to.not.equal(null);
	      // response should be deep equal to `newItem` from above if we assign
	      // `id` to it from `res.body.id`
	      expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(422);
      });
  });

  it('Should get item on GET', function () {
		const expectedKeys = ['id', 'userId', 'wineId', 
		'name', 'description', 'cost', 'rating', 
		'type', 'region', 'state', 'winery'];

  	return chai.request(app)
      .get('/mylist')
      .set('authorization', `Bearer ${TOKEN}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        res.body.forEach(function(item) {
		      expect(item).to.be.a('object');
		      expect(item).to.include.keys(expectedKeys);
    		});
      });
  });


	it('should update item on PUT', function() {
    const updateData = {'comments': 'testing'};

    return chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/mylist')
      .set('authorization', `Bearer ${TOKEN}`)
      .then(res => {
        updateData.id = newItem.id;
        return chai.request(app)
          .put(`/mylist/${updateData.id}`)
          .set('authorization', `Bearer ${TOKEN}`)
          .send(updateData)
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });


  it('should delete item on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/mylist')
      .set('authorization', `Bearer ${TOKEN}`)
      .then(function(res) {
        return chai.request(app)
        	.delete(`/mylist/${newItem.id}`)
        	.set('authorization', `Bearer ${TOKEN}`)
          
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});