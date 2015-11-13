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

function createUser (req, res) {
	if (req.body.email_address && req.body.password) {
		// need to validate webtoken first
		UserService.createUser(req.body).then(function () {
			res.status(201).json({
				access_token: JsonWebToken.sign(user, process.env[envKeys[0]], { expiresIn: 360000 })
			});
		}).catch(function (error) {
			res.status(500).json({
				error: 'Internal Server Error: ' + error
			});
		});
		
	}
	else {
		res.status(400).json({
			error: 'Missing Email or Password'
		});
	}
}

router.post('/', createUser);

module.exports = router;