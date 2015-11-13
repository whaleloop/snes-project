'use strict';

var express = require('express'),
	router = express.Router(),
	UserService = require('../services/userService'),
	JsonWebToken = require('jsonwebtoken'),
	envKeys = [
		'SECRET_KEY'
	];

router.use(function timeLog(req, res, next) {
	console.log('Request made at: ', Date.now());
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Token');
	next();
});

function errorHandler (res, status, error) {
	return res.status(status).json({
		error: error
	});
}

function createUser (req, res) {
	try {
		// decode webtoken
		var decoded = JsonWebToken.verify(req.headers['access-token'], process.env[envKeys[0]]);
		// if webtoken doesnt trigger catch check if user is in db already
		UserService.getUserByEmail(req.body.email_address).then(function (result) {
			if (req.body.email_address === result.email_address) {
				errorHandler(res, 401, 'User account already exists.');
				// user exists need to reject promise
				return Promise.reject('User Exists');
			}
			// if user doesn't exist create one
			return UserService.createUser(req.body);
		}).then(function (user) {
			// return created status
			res.status(201).send();
		}).catch(function (error) {
			// check if error is string from rejected promise
			if (error === 'User Exists') {
				errorHandler(res, 401, 'User account already exists.');
			} else {
				// catch all error
				errorHandler(res, 500, 'Internal Server Error: ' + error);
			}
		});
	}
	catch(error) {
		errorHandler(res, 401, error);
	}
}

router.post('/', createUser);

module.exports = router;