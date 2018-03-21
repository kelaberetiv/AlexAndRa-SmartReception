var shell = require('shelljs');
/*
executes sh/alexabt.sh
***Operations***

Connect:
alexabt.sh connect <bluetooth mac address>

Disconnect
alexabt.sh disconnect <bluetooth mac address>(Optional)

******
*/
module.exports = {
	disconnect: function (callback = null) {
		shell.exec('sh sh/alexabt.sh disconnect', () => { console.log('Status : BT Disconnected'); if (callback) callback(); });
	},
	connect: function (deviceId, callback = null) {
		shell.exec('sh sh/alexabt.sh connect ' + deviceId, {}, () => { console.log('Status : BT Connected to ' + deviceId); if (callback) callback(); });
	}
}
