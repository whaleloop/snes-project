'use strict';

var config = require('./config/config.js'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	server,
	port;

function setupMiddleWare () {
	var authRouter = require('./controllers/authController'),
		userRouter = require('./controllers/userController');

	app.use(bodyParser.json());
	app.use('/', authRouter);
	app.use('/users', userRouter);
}

function launchServer () {
	// add in middleware and routes
	setupMiddleWare();
	// start server
	server = app.listen(process.env.PORT, function () {
		console.log('SNES Server listening on port %s', server.address().port);
	});
}


// start program by checking enviroment variables and database setup then launching server
config.setupEnvironmentVariables().then(function () {
	return config.setupDatabase(launchServer);
});
