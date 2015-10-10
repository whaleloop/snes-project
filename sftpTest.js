(function () {
	'use strict';
	
	var fs = require('fs'),
		Client = require('ssh2').Client,
		conn = new Client();

	function connectSftp (err, sftp) {
		if (err) {
			throw err;
		}

		sftp.readdir('./RetroPie/roms', function (err, list) {
			if (err) throw err;
			console.dir(list);
			conn.end();
		});
	} 

	function onReady () {
		console.log('Client :: ready');
		conn.sftp(connectSftp);
	}

	conn.on('ready', onReady).connect({
		host: '192.168.0.12',
		port: 22,
		username: 'pi',
		password: 'raspberry'
	});

})();