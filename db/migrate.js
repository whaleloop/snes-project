(function (require, process, console) {
	'use strict';

	var pg = require('pg-promise')(),
		config = require('../config/config.js'),
		conString, 
		db,
		Promise = require('promise');

	// check to see if environment variable needs to be set up
	if (!process.env.DATABASE_URL) {
		config.setupEnvironmentVariables();
	}

	conString = process.env.DATABASE_URL;
	db = pg(conString);

	function errorHandler (error) {
		console.log('ERROR: ', error);
	}

	// // test connection
	var connection;
	db.connect().then(function (response) {
		connection = response;
		console.log('connection: ', response);
		process.exit();
	}, errorHandler);

	// // migrate db
 //    db.tx(function(){
 //        var promises = [];

 //        for (var i=0; i<migrations.length; i++) {
 //            promises.push(this.none(migrations[i]));
 //        }

 //        return Promise.all(promises).then(function() {
 //            console.log('Migrations Complete');
 //        });
 //    }).then(function(){
 //        // close the connection to db
 //        pg.end();
 //    }, errorHandler);

})(require, process, console);