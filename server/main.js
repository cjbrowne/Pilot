var sio = require('socket.io');
module.exports = {
	listen: function(connect_server) {
		var io = sio.listen(connect_server),
			game = require('./game.js');
		io.sockets.on('connection',function(socket) {

		});
	}
}