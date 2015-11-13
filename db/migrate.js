'use strict';

var pg = require('pg-promise')(),
	config = require('../config/config.js'),
	dbKey = 'DATABASE_URL', 
	db,
	Promise = require('promise'),
	migrations = require('./migrations.json').migrations;

// check to see if environment variable needs to be set up
if (!process.env.DATABASE_URL) {
	config.setupEnvironmentVariables();
}

db = pg(process.env[dbKey]);

function errorHandler (error) {
	console.log('ERROR: ', error);
}

// migrate db
db.tx(function(){
   var promises = [];

   for (var i=0; i<migrations.length; i++) {
       promises.push(this.none(migrations[i]));
   }

   return Promise.all(promises).then(function() {
       console.log('Migrations Complete');
   });
}).then(function(){
   // close the connection to db
   pg.end();
}, errorHandler);