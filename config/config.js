'use strict';

var configData = require('./config.json'),
	envKeys = [
		'DATABASE_URL',
		'PORT'
	];

function setupEnvironmentVariables () {
	if (!configData) {
		console.log('You have no config file setup.');
		process.exit(1);
	}
	process.env[envKeys[0]] = configData.databaseUrl;
	process.env[envKeys[1]] = configData.port;
}


module.exports = {
	setupEnvironmentVariables: setupEnvironmentVariables
};