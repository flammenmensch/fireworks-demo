/**
 * Created by flammenmensch on 05.08.14.
 */
function DesktopClient(uuid, socket) {
	this.uuid = uuid;
	this.socket = socket;
	this.pin = '';
	this.protected = false;
	this.associatedDevices = [ ];
}

DesktopClient.prototype = {
	addDevice: function (device) {
		var hasDevice = this.associatedDevices.some(function (d) {
			return device.uuid === d.uuid;
		});

		if (!hasDevice) {
			this.associatedDevices.push(device);
		}
	},

	removeDevice: function (device) {
		this.associatedDevices.
	},

	disconnect: function () {
		this.socket.disconnect();

		this.associatedDevices.forEach(function (device) {
			device.socket.emit('desktop:disconnect');
		});
	}
};

module.exports = DesktopClient;