'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Opa Grappa', function () {
 //  before(function() {
	// 	return runServer();
	// });

	// after(function() {
	// 	return closeServer();
	// });

	it('should return response 200 and index.html', function() {
		return chai.request(app)
			.get('/')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			})
	});

	it('should return response 200 and signup.html', function() {
		return chai.request(app)
			.get('/signup')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			})
	});

	it('should return response 200 and login.html', function() {
		return chai.request(app)
			.get('/login')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			})
	});

	it('should return response 200 and dashboard.html', function() {
		return chai.request(app)
			.get('/dashboard')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			})
	});
});