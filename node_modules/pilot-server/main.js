var sio = require('socket.io');
module.exports = {
	listen: function(connect_server) {
		var io = sio.listen(connect_server),
			Game = require('./Game.js');
		var game = new Game(io);
		game.run();
	}
}