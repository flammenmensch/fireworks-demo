var socketIo = require('socket.io');

module.exports = function (app) {
	var io = socketIo.listen(app);

	io.on('connect', function (socket) {
		console.log('Someone connected to default room');

		socket.on('disconnect', function () {
			console.log('Someone disconnected from default room');
		});
	});

	return io;
};