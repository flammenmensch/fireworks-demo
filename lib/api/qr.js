var express = require('express');
var qr = require('qr-image');

var router = express.Router();

router.route('/')
	.get(function (req, res, next) {
		var data = req.param('data') || '';

		console.log('[API] Requesting QR Code: "%s"', data);

		res.type('image/png');
		qr.image(data, { type: 'png', size: 10, margin: 1 }).pipe(res);
	});


module.exports = router;