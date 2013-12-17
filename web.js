var connect = require('connect'),
	pilot = require('server');
connect.createServer(connect.static(__dirname + '/client')).listen(process.env.PORT || 80);
pilot.listen(connect);