'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Opa Grappa', function () {
  before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});
	
	it('should return response 200 and html', function() {
		return chai.request(app)
			.get('/')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.html;
			})
	});
});