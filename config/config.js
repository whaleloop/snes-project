'use strict';

var configData = require('./config.json'),
	Task = require('child-process-promise').exec,
	Promise = require('promise'),
	envKeys = [
		'DATABASE_URL',
		'PORT',
		'SECRET_KEY'
	];

function setupEnvironmentVariables () {
	if (!process.env[envKeys[1]]) {
		if (!configData) {
			console.log('You have no config file setup.');
			process.exit(1);
		}
		process.env[envKeys[0]] = 'postgres://' + configData.username + ':' + configData.password + '@localhost/' + configData.database;
		process.env[envKeys[1]] = configData.port;
		process.env[envKeys[2]] = configData.secret;
	}
	return Promise.resolve();
}

function setupDatabase (cb) {
	function done () {
		console.log('Database is setup.');
		cb();
	}

	function setupDb () {
		var commands = [
			'echo $(psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname=\'' + configData.username + '\'")',
			'echo "CREATE USER ' + configData.username + ' WITH PASSWORD \'' + configData.password + '\';" | psql',
			'echo $(psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname=\'' + configData.database + '\'")',
			'echo "CREATE DATABASE ' + configData.database + ';" | psql',
			'echo "GRANT ALL PRIVILEGES ON DATABASE ' + configData.database + ' to ' + configData.username + ';" | psql',
			'echo "ALTER ROLE ' + configData.username + ' WITH LOGIN;" | psql'
		];

		return new Task(commands[0])
			.then(function (result) {
				if (result.stdout.trim() !== '1') {
					return new Task(commands[1]);
				} else {
					return new Task('echo User already exists');
				}
			}).then(function (result) {
				console.log(result.stdout);
				return new Task(commands[2]);
			}).then(function (result) {
				if (result.stdout.trim() !== '1') {
					return new Task(commands[3]);
				} else {
					return new Task('echo Database already exists');
				}
			}).then(function (result) {
				console.log(result.stdout);
				return new Task(commands[4]);
			}).then(function () {
				return new Task(commands[5]);
			});
	}

	if (!configData) {
		console.log('You have no config file setup.');
		process.exit(1);
	}

	setupDb().then(function () {
		done();
	}).fail(function (err) {
		if (err) {
			console.log('Error setting up database.', err);
			process.exit(1);
		}
	});
	
}


module.exports = {
	setupEnvironmentVariables: setupEnvironmentVariables,
	setupDatabase: setupDatabase
};