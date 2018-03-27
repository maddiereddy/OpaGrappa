const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/views/index.html');
});

router.get('/signup', (req, res) => {
	res.sendFile(__dirname + '/public/views/signup.html');
});

router.get('/login', (req, res) => {
	res.sendFile(__dirname + '/public/views/login.html');
});

router.get('/dashboard', (req, res) => {
	res.sendFile(__dirname + '/public/views/dashboard.html');
});

module.exports = router;