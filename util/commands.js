#! /usr/bin/env node

var shell = require('shelljs');

if (process.argv[2] === 'install') {
	shell.exec('echo installing....');
	shell.exec('sudo cp ./util/startup.sh ~/Desktop/');
	shell.exec('sudo chmod 755 ~/Desktop/startup.sh');
	// shell.exec('sudo update-rc.d startup.js defaults');
} else if (process.argv[2] === 'startup') {
	shell.exec('echo starting....');
	require('../app');
}

// shell.exec('sudo cp ./util/startup.sh /etc/init.d/startup.sh');
// shell.exec('sudo chmod 755 /etc/init.d/startup.sh');
// shell.exec('sudo update-rc.d startup.sh defaults');