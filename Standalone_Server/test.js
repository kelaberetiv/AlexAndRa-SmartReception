var shell = require('shelljs');

shell.exec('sh alexabt.sh disconnect', () => { console.log("done") });
