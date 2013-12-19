module.exports = (function() {
	var OctTree = require('./OctTree.js');
	var Game = function(io) {
		this.io = io;
	}
	Game.prototype = {
		clients: new OctTree({
			/// @todo abstract boundary information into a configuration file, share information between client and server
			rootNodeInformation: {
				bounds: {
					x: 0,
					y: 0,
					z: 0,
					width: 1500,
					height: 1500,
					depth: 1500
				}
			}
		}),
		run: function() {
			if(!this.io) {
				throw new Error("Socket.io object unavailable.");
			}
			var io = this.io;
			io.sockets.on('connect',function(socket) {
				var spawnLocation = Position.random();
			});
		}
	}
	return Game;
})();