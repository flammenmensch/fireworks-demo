var express = require('express');
var router = express.Router();

router.use('/', express.static(__dirname + '/public/desktop'));
router.use('/mobile/fireworks', express.static(__dirname + '/public/mobile/fireworks'));
router.use('/vendors', express.static(__dirname + '/public/vendors'));

module.exports = router;