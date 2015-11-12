'use strict';

var fs = require('fs'),
	Client = require('ssh2').Client,
	conn = new Client();

// fs.readFile('../../roms/snes/DonkeyKongCountry(USA).sfc', function (err, data) {
// 	if (err) {
// 		throw err;
// 	}
// 	console.log(data);
// });

function connectSftp (err, sftp) {
	if (err) {
		throw err;
	}

	// sftp.readdir('./RetroPie/roms', function (err, list) {
	// 	if (err) throw err;
	// 	console.dir(list);
	// 	conn.end();
	// });

	var readStream = fs.createReadStream('../../roms/snes/Tiny\ Toon\ Adventures\ -\ Buster\ Busts\ Loose!\ (USA).sfc');
    var writeStream = sftp.createWriteStream('./RetroPie/roms/snes/Tiny\ Toon\ Adventures\ -\ Buster\ Busts\ Loose!\ (USA).sfc');

    // what to do when transfer finishes
    writeStream.on('close', function () {
        console.log( '- file transferred' );
        sftp.end();
        conn.end();
    });

    // initiate transfer of file
    readStream.pipe( writeStream );
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