'use strict';

var Promise = require('promise'),
	pg = require('pg-promise')(),
	uuid = require('uuid'),
	bcrypt = require('bcrypt'),
	envVar = 'DATABASE_URL',
	db = pg(process.env[envVar]),
	UserQueries = require('../db/queries.json').user;

function getUserByEmail (email) {
	return db.one(UserQueries.getByEmail, [email]);
}

function createUser (user) {
	var salt = bcrypt.genSaltSync(),
		hash = bcrypt.hashSync(user.password, salt),
		values = [
			uuid.v1(),
			user.email_address,
			hash,
			salt
		];

	return db.any(UserQueries.add, values);
}

module.exports = {
	getUserByEmail: getUserByEmail,
	createUser: createUser
};