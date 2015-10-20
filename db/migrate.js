(function (require, process) {
	'use strict';

	var pg = require('pg-promise'),
		conString = process.env.DATABASE_URL || 'postgres://snesuser:snes123@localhost/snes'

})(require, process);