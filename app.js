'use strict';

var config = require('./config/config.js'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	server,
	port;

// check to see if environment variable needs to be set up
if (!process.env.PORT) {
	config.setupEnvironmentVariables();
}

port = process.env.PORT;

app.use(bodyParser.json());

function launchServer () {
	return app.listen(port, function () {
		console.log('SNES Server listening on port %s', server.address().port);
	});
}

// start server
server = launchServer();