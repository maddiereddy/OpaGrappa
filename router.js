const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

module.exports = router;