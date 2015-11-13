'use strict';

var express = require('express'),
	router = express.Router(),
	UserService = require('../services/userService'),
	JsonWebToken = require('jsonwebtoken'),
	bcrypt = require('bcrypt'),
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

function login (req, res) {
	if (req.body.email_address && req.body.password) {
		UserService.getUserByEmail(req.body.email_address).then(function (user) {
			if (bcrypt.compareSync(req.body.password, user.hashed_password)) {
				res.status(200).json({
					user: {
						id: user.user_account_uuid,
						email_address: user.email_address
					},
					access_token: JsonWebToken.sign(user, process.env[envKeys[0]], { expiresIn: 360000 })
				});
			}
			else {
				res.status(401).json({
					error: 'Wrong email or password'
				});
			}
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

router.post('/login', login);

module.exports = router;