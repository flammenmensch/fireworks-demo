var express = require('express');
var router = express.Router();

var qr = require('./lib/api/qr');

router.use('/qr', qr);

router.get('/', function (req, res) {
	res.json({ result: 'ok', data: {
		apiVersion: '0.1.0',
		status: 'ok'
	} });
});

module.exports = router;