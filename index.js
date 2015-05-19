var express = require('express');
var socketio = require('socket.io');
var http = require('http');

var app = express();

var routes	= require('./routes');
var api		= require('./api');

var fireworks = require('./lib/socket/fireworks-demo');

app.use(routes);
app.use('/api', api);

var server = http.createServer(app);

var io = socketio.listen(server);

var fw = fireworks(io);

server.listen(process.env.PORT || 8000, function (err) {
	if (err) {
		return console.error(err);
	}

	console.info('Server started');
});