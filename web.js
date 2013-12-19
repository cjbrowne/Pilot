var connect = require('connect'),
	pilot = require('pilot-server');
var srv = connect.createServer(connect.static(__dirname + '/client')).listen(process.env.PORT || 80);
pilot.listen(srv);