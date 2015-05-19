var uuid = require('node-uuid');

module.exports = function (io) {

	var ns = io.of('/adluxe/fireworks');

	var desktops = { };
	var devices  = { };

	ns.on('connect', function (socket) {
		var clientId = uuid.v1();

		socket.on('desktop:connect', function () {
			console.log('Desktop client {%s} connected', clientId);

			desktops[clientId] = {
				socket: socket,
				pin: '1234',
				secured: true,
				devices: [ ]
			};

			socket.on('disconnect', function () {
				console.log('Desktop {%s} disconnected', clientId);

				var desktop = desktops[clientId];

				if (desktop !== undefined) {
					desktop.socket.disconnect();

					desktop.devices.forEach(function (deviceId) {
						if (devices[deviceId]) {
							//devices[deviceId].socket.emit('desktop:disconnected');
							devices[deviceId].socket.disconnect();
							devices[deviceId] = null;

							delete devices[deviceId];
						}
					});

					desktops[clientId] = null;

					delete desktops[clientId];
				}
			});

			socket.emit('connection:complete', { uuid: clientId });
		});

		socket.on('device:connect', function (data) {
			console.log('Device client {%s} connected', clientId);

			socket.on('disconnect', function () {
				console.log('Device {%s} disconnected', clientId);

				if (devices[clientId]) {
					console.log('Disconnecting device client {%s}', clientId);

					devices[clientId].socket.disconnect();

					var associatedDesktop = desktops[devices[clientId].desktopId];

					if (associatedDesktop) {
						console.log('Notifying desktop about device disconnect');

						associatedDesktop.socket.emit('device:disconnected', { uuid: clientId });

						var index = associatedDesktop.devices.indexOf(clientId);

						if (index > -1) {
							associatedDesktop.devices.splice(index, 1);
						}
					}

					devices[clientId] = null;

					delete devices[clientId];
				}
			});

			// check pin and uuid here
			if (!data || !data.uuid || !data.pin) {
				console.log('Invalid data parameters', data);
				return socket.disconnect();
			}

			if (!desktops[data.uuid]) {
				//return socket.emit('error', 'No such UUID');
				console.log('Invalid desktop uuid: {%s}', data.uuid);
				return socket.disconnect();
			}

			/*if (desktops[data.uuid].secured && desktops[data.uuid].pin !== data.pin) {
				//return socket.emit('error', 'Invalid PIN');
				console.log('Invalid PIN');
				return socket.disconnect();
			}*/

			devices[clientId] = {
				socket: socket,
				desktopId: data.uuid
			};

			desktops[data.uuid].devices.push(clientId);
			desktops[data.uuid].socket.emit('device:connectionComplete');

			socket.emit('connection:complete', { uuid: clientId });
		});

		socket.on('device:motion', function (data) {
			console.log('Received motion event from device {%s}', clientId);

			var desktopId = devices[clientId].desktopId;

			if (desktops[desktopId]) {
				desktops[desktopId].socket.emit('device:motion', data);
			}
		});

		socket.on('device:tap', function () {
			console.log('Received tap event from device {%s}', clientId);

			var desktopId = devices[clientId].desktopId;

			if (desktops[desktopId]) {
				desktops[desktopId].socket.emit('device:tap');
			}
		});
	});
};